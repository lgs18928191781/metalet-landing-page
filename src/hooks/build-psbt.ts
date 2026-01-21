import { createGlobalState } from '@vueuse/core'
import { type Ref, ref } from 'vue'
import { isTaprootInput } from 'bitcoinjs-lib/src/psbt/bip371'
import { Decimal } from 'decimal.js'
import {

networks,
payments,
Transaction,
Psbt
} from 'bitcoinjs-lib'
import { Buffer } from 'buffer'
import { useBtcJsStore } from '@/stores/btcjs'
import { useChainStore } from '@/stores/chain'
import {broadcast,getUtxoRawTx} from '@/api/metalet-v3'
import toast from '@/utils/toast'

const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4 // 41
const TX_INPUT_PUBKEYHASH = 107
const TX_INPUT_SEGWIT = 27
const TX_INPUT_TAPROOT = 17 // round up 16.5 bytes
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25
const TX_OUTPUT_SCRIPTHASH = 23
const TX_OUTPUT_SEGWIT = 22
const TX_OUTPUT_SEGWIT_SCRIPTHASH = 34
const TX_INPUT_PUBKEY_HASH = 107
const TX_OUTPUT_SEGWIT_SCRIPT_HASH = 34
const TX_OUTPUT_PUBKEY_HASH = 25
const TX_OUTPUT_SCRIPT_HASH = 23


export interface TransactionOutput {
  script: Buffer
  value: number
}

export interface PsbtTxOutput extends TransactionOutput {
  address: string | undefined
}

export enum ScriptType {
P2WPKH = 'P2WPKH',
P2PKH = 'P2PKH',
P2SH_P2WPKH = 'P2SH-P2WPKH',
P2TR = 'P2TR',
}

export interface UTXO {
txId: string
rawTx?: string
satoshis: number
confirmed: boolean
outputIndex: number
}

export interface PsbtInput {
hash: string
index: number
witnessUtxo?: {
script: Buffer
value: number
}
tapInternalKey?: Buffer
nonWitnessUtxo?: Buffer
redeemScript?: Buffer
}

export enum AddressType {
Legacy = 'Legacy',
NativeSegwit = 'Native Segwit',
NestedSegwit = 'Nested Segwit',
Taproot = 'Taproot',
SameAsMvc = 'Same as MVC',
LegacyMvc = 'MVC',
LegacyMvcCustom = 'MVC Custom',
}

export enum Purpose {
BIP44 = 44,
BIP49 = 49,
BIP84 = 84,
BIP86 = 86,
}

export enum CoinType {
NULL = -1, // unknown coin type
BTC = 0,
MVC = 10001,
BSV = 236,
}


export const useBuildPsbt = createGlobalState(() => {





async function getPubkey() {
   const pukStr= await window.metaidwallet?.btc.getPublicKey()
   let pubkeyBuffer: Buffer
    if (typeof pukStr === 'string') {
    // 如果是十六进制字符串，转换为 Buffer
    if (pukStr.startsWith('02') || pukStr.startsWith('03') || pukStr.startsWith('04')) {
      pubkeyBuffer = Buffer.from(pukStr, 'hex')
    } else {
      throw new Error('Invalid public key format')
    }
  } else if (Buffer.isBuffer(pukStr)) {
    pubkeyBuffer = pukStr
  } else {
    throw new Error('Public key must be Buffer or hex string')
  }
  return pubkeyBuffer
}

   async function getPayment(){
    
    const scriptType=await getScriptType()
   
    const publicKey =await getPubkey()

     switch (scriptType) {
        case ScriptType.P2PKH:
          //@ts-ignore
          return payments.p2pkh({ pubkey: publicKey, network: networks.bitcoin })
        case ScriptType.P2SH_P2WPKH:
          return payments.p2sh({
            
            redeem: payments.p2wpkh({
                //@ts-ignore
              pubkey: publicKey,
              network: networks.bitcoin,
            }),
          })
        case ScriptType.P2WPKH:
            //@ts-ignore
          return payments.p2wpkh({ pubkey: publicKey, network: networks.bitcoin })
        case ScriptType.P2TR:
      
          return payments.p2tr({
                  //@ts-ignore
            internalPubkey: publicKey!.subarray(1),
            network: networks.bitcoin,
          })
        default:
            //@ts-ignore
          return payments.p2pkh({ pubkey: publicKey, network: networks.bitcoin })
          // throw new Error('Invalid script type')
      }
   }

  async function getScriptType(){
    try {
      const res=await window.metaidwallet?.btc.getAddressType()
      
    return res!.addressType as ScriptType
    } catch (error) {
     return ScriptType.P2WPKH
    }
   }

 
  // actions
   const createPsbtInput=async (utxo: UTXO) =>{
      console.log("createPsbtInput",utxo)
      const payInput: PsbtInput = {
        hash: utxo.txId,
        index: utxo.outputIndex,
      }
  
      const payment =await getPayment()
      const scriptType =await getScriptType()
     
      if ([ScriptType.P2SH_P2WPKH, ScriptType.P2WPKH].includes(scriptType)) {
              //@ts-ignore
        payInput.witnessUtxo = { script: payment.output!, value: utxo.satoshis }
      }
  
      if (['P2TR'].includes(scriptType)) {
              //@ts-ignore
        payInput.tapInternalKey = await getPubkey().subarray(1)
              //@ts-ignore
        payInput.witnessUtxo = { value: utxo.satoshis, script: payment.output! }
      }
  
      if (['P2PKH'].includes(scriptType)) {
        if (!utxo?.rawTx) {
          const rawTxResult = await getUtxoRawTx({ txId:utxo.txId })
          utxo.rawTx=rawTxResult.rawTx
          if(!utxo?.rawTx){
             throw new Error(
            `Legacy transactions require passing rawTx to the UTXO.The UTXO with id ${utxo.txId} is missing rawTx.`,
          )
          }
        }
        const tx = Transaction.fromHex(utxo.rawTx)
        
          const buffer = tx.toBuffer()
           // 验证 buffer 类型
           
  if (!Buffer.isBuffer(buffer)) {
    // 如果是 Uint8Array，转换为 Buffer
    if (buffer instanceof Uint8Array) {
      payInput.nonWitnessUtxo = Buffer.from(buffer)
    } else {
      // 如果是普通对象，尝试重新创建 Buffer
      payInput.nonWitnessUtxo = Buffer.from(utxo.rawTx, 'hex')
    }
  } else {
    payInput.nonWitnessUtxo = buffer
  }
        
        //payInput.nonWitnessUtxo = tx.toBuffer()
      }
  
      if (['P2SH-P2WPKH'].includes(scriptType)) {
              //@ts-ignore
        payInput.redeemScript = payment.redeem?.output
      }
  
      return payInput
    }



  const buildPsbt = async(buildPsbtParams: {
    amount: Decimal
    recipient: string
  },selectedUTXOs: UTXO[]) => {
    const btcjs=useBtcJsStore().get!
        const {
        amount,
        recipient,
        } = buildPsbtParams
        console.log("btcjs",btcjs)
        
        const psbt = new btcjs.Psbt({ network: networks.bitcoin })
        for (const utxo of selectedUTXOs) {

        try {
        const psbtInput =await createPsbtInput(utxo)
              //@ts-ignore
        psbt.addInput(psbtInput)
        }catch (error: unknown) {
        throw error as Error
        }

        }
        psbt.addOutput({
        address: recipient,
              //@ts-ignore
        value: new Decimal(amount).toNumber(),
        })

        return psbt
 
  }

  const getTotalSatoshi=(utxos: UTXO[])=> {
      return utxos.reduce(
        (total, utxo) => total.add(utxo.satoshis),
        new Decimal(0),
      )
    }

       async function transactionBytes(
        inputs: PsbtInput[],
        outputs: PsbtTxOutput[],
        isTaproot = false,
        ) {
        const inputsSize = inputs.reduce(function (a, x) {
        return a + inputBytes(x)
        }, 0)
        const outputsSize = outputs.reduce(function (a, x) {
        return a + outputBytes(x)
        }, 0)

        if (isTaproot) {
        return TX_EMPTY_SIZE + Math.floor(inputsSize) + 1 + outputsSize
        }

        return TX_EMPTY_SIZE + inputsSize + outputsSize
        }


        function inputBytes(input: PsbtInput) {

        return (
        TX_INPUT_BASE +
        (input.redeemScript ? input.redeemScript.length : 0) +
              //@ts-ignore
        (input.witnessScript
                //@ts-ignore
        ? input.witnessScript.length / 4
              //@ts-ignore
        : isTaprootInput(input)
        ? TX_INPUT_TAPROOT
        : input.witnessUtxo
        ? TX_INPUT_SEGWIT
        : !input.redeemScript
        ? TX_INPUT_PUBKEY_HASH
        : 0)
        )
        }

        function outputBytes(output: PsbtTxOutput) {
        return (
        TX_OUTPUT_BASE +
        (output.script
        ? output.script.length
        : output.address?.startsWith('bc1') || output.address?.startsWith('tb1')
        ? output.address?.length === 42
        ? TX_OUTPUT_SEGWIT
        : TX_OUTPUT_SEGWIT_SCRIPT_HASH
        : output.address?.startsWith('3') || output.address?.startsWith('2')
        ? TX_OUTPUT_SCRIPT_HASH
        : TX_OUTPUT_PUBKEY_HASH)
        )
        }

        const estimateTxSize=async(psbt: Psbt, isTaproot: boolean)=> {
          
        const inputs = psbt.data.inputs
        const outputs = psbt.txOutputs
              //@ts-ignore
        return await transactionBytes(inputs, outputs, isTaproot)
        }


        const calculateFee=async (psbt: Psbt, feeRate: number) => {
        let size = 0
        try {
        const tx = psbt.extractTransaction()
        size = tx.virtualSize()
        } catch {
        const scriptType=await getScriptType()
        size =await estimateTxSize(
        psbt,
        scriptType === ScriptType.P2TR,
        )
        }
        return new Decimal(size).mul(feeRate)
        }

  const buildTx=async (params:{
    utxos: UTXO[],
    feeRate?: number,
    buildPsbtParams:{
    amount:Decimal,
    recipient:string
    }
  })=>{
    const btcjs=useBtcJsStore().get!
    const chainStore=useChainStore()
    const {recipient}=params.buildPsbtParams
    let total = getTotalSatoshi(params.utxos)
    let psbt =await buildPsbt(params.buildPsbtParams,  params.utxos)
    let feeRate=params.feeRate ? params.feeRate : chainStore.btcFeeRate()
    let estimatedFee =await calculateFee(psbt, feeRate)

      psbt=await buildPsbt(
        {
            amount:total.minus(estimatedFee),
            recipient:recipient
        },
        params.utxos,
      )
  
     const psbtSignerRes= await window.metaidwallet?.btc.signPsbt({psbtHex:psbt.toHex()})
     
     const payPsbt = btcjs.Psbt.fromHex(psbtSignerRes,{network:networks.bitcoin})
     const payTxRaw = payPsbt.extractTransaction().toHex()
     const tx=await broadcast(payTxRaw,'btc')
     
    return tx
  }


  const estimatedTxFee=async (params:{
    utxos: UTXO[],
    feeRate?: number,
    buildPsbtParams:{
    amount:Decimal,
    recipient:string
    }
  })=>{
    
    const chainStore=useChainStore()
    const {recipient}=params.buildPsbtParams
    let total = getTotalSatoshi(params.utxos)
    let psbt = await buildPsbt(params.buildPsbtParams,  params.utxos)
    let feeRate=params.feeRate ? params.feeRate : chainStore.btcFeeRate()  
     let estimatedFee =await calculateFee(psbt, feeRate)

    return {
      estimatedFee,
      total,
      utxos:params.utxos,
      amount:total.minus(estimatedFee),
      recipient,
      feeRate:feeRate
    }
    //   psbt=buildPsbt(
    //     {
    //         amount:total.minus(estimatedFee),
    //         recipient:recipient
    //     },
    //     params.utxos,
    //   )

    //  const psbtSignerRes= await window.metaidwallet?.btc.signPsbt(psbt.toHex())
    //  const payPsbt = btcjs.psbt.fromHex(psbtSignerRes,{network:networks.bitcoin})
    //  const payTxRaw = payPsbt.extractTransaction().toHex()
    //  console.log('payTxRaw',payTxRaw)
    //  
  }

  

  return {
   buildTx,
   estimatedTxFee
  }
})