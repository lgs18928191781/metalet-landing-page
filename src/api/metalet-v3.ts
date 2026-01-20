import { HttpRequest } from '@/utils/http'
import { useConfig } from '@/hooks/use-config';

const {
  metaletV3Url
} = useConfig();

export interface pinInfo{
      
        id: string,
        number: number,
        metaid: string,
       address: string,
       createAddress:string,
       creatorUserInfo: {
          name: string,
          avatar: string
        },
        creator: string,
        avatar: string,
        output: string,
        outputValue: number,
        timestamp: number,
        genesisFee: number,
        genesisHeight: number,
        genesisTransaction: string,
        txIndex: number,
        txInIndex: number,
        offset: number,
        location: string,
        operation: "create" | 'modify' | 'revoke',
        path: string,
        parentPath: string,
        originalPath: string,
        encryption: "0" | '1',
        version: string,
        contentType: string,
        contentTypeDetect: string,
        contentBody: string,
        contentLength: number,
        contentSummary: string,
        mrc721File: string,
        mrc721FileUrl: string,
        status: number,
        preview: string,
        content:string,
        pop: string,
        popLv: number,
        chainName: "btc" | 'mvc'
      
}

export interface pinRes{
    total:number
    list:pinInfo[]
}


// 创建 MAN API 实例，配置自定义响应处理
const metaletV3ApiInstance = new HttpRequest(
  `${metaletV3Url.value}` || 'https://www.metalet.space/wallet-api/v3',
  {
    // 自定义响应处理器（适配 MAN API 的响应格式）
    responseHandler: (response) => {
      return new Promise((resolve, reject) => {
        const { data } = response
        
        // MAN API 响应格式：{ code: 1, data: {...}, message: '...' }
        if (data && typeof data.code === 'number') {
          if (data.code === 0) {
            // 成功：返回 data 字段
            resolve(data.data)
          } else {
            // 失败：返回错误信息
            reject({
              code: data.code,
              message: data.message || '请求失败',
            })
          }
        } else {
          // 兼容其他格式，直接返回 data
          resolve(data.data || data)
        }
      })
    },
  }
)

// 导出 API 实例（保持原有的使用方式）
const metaletV3Api = {
  get: metaletV3ApiInstance.get.bind(metaletV3ApiInstance),
  post: metaletV3ApiInstance.post.bind(metaletV3ApiInstance),
  put: metaletV3ApiInstance.put.bind(metaletV3ApiInstance),
  delete: metaletV3ApiInstance.delete.bind(metaletV3ApiInstance),
}

export interface GetPinListParams {
    address?:string
    addressType?:'owner' | 'creator'
    cursor?: number
    size?: number
    cnt?:boolean
    net?:'livenet' | 'testnet'

}

export interface GetRawTxParams {
    txId?:string
    chain?:'btc'
    verbose?:boolean
    net?:'livenet' | 'testnet'

}



export const getPinListByAddreeWithBtc = async (  params: GetPinListParams = {}): Promise<pinRes> => {
      const { cursor = 0, size = 50,cnt=true,address='',net='livenet',addressType='owner' } = params
        const query = new URLSearchParams({
        cursor: cursor.toString(),
        size: size.toString(),
        cnt:cnt.toString(),
        addressType:addressType,
        address:address,
        net:net

  }).toString()

  return metaletV3Api.get(`/address/pins?${query}`).then(res => {
    
    return res
  }).catch((e)=>{
    throw new Error(e)
  })
}

export const getUtxoRawTx = async (  params: GetRawTxParams = {}): Promise<{rawTx:string}> => {
      const { txId = '', chain = 'btc',verbose=false,net='livenet' } = params
        const query = new URLSearchParams({
        txId: txId,
        chain: chain,
        verbose:verbose.toString(),
        net:net

  }).toString()

  return metaletV3Api.get(`/tx/raw?${query}`).then(res => {
    
    return res
  }).catch((e)=>{
    throw new Error(e)
  })
}


export const getRatePrice = async (): Promise<{priceInfo:{
  btc:number
  doge:number
  space:number
}}> => {
  return metaletV3Api.get(`/coin/price`).then(res => {
    
    return res
  }).catch((e)=>{
    throw new Error(e)
  })
}

export async function broadcast(tx: string,chain?:string): Promise<any> {
    
  const network = 'mainnet'


  const body = JSON.stringify({ rawTx: tx, net: network, chain: chain })
  return await fetch(`https://www.metalet.space/wallet-api/v3/tx/broadcast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((res) => res.json())
    .then((res) => {
      console.log({ res })
      return res
    })
    .then((result) => {
      
      if(result.code == 0){
        return result.data
      }else{
        throw new Error(result.message)
      }
    }).catch(e=>{
      throw new Error(e)
    })
}





