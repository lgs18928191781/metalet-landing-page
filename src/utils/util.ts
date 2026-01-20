import { type AttachmentItem } from "@/types/common";
import { useChainStore } from '@/stores/chain';
import { OutputSize, BaseSize, InputSize, OpReturnOverhead } from '@/data/constants';
export function sleep(timer = 2000) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}

export function completeReload() {
  // dump search params then reload
  const url = new URL(window.location.href)

  url.searchParams.delete('clear')
  url.searchParams.delete('address')

  window.location.href = url.href

  return
}

export async function getFileDataFromUrl(fileUrl: string): Promise<ArrayBuffer | undefined> {
  try {
    const response = await fetch(fileUrl)

    const arrayBuffer = await response.arrayBuffer()

    return arrayBuffer
  } catch (error) {}
}

export function hexToBase64(hexString: string) {
  // 移除可能存在的空格和前缀
  const cleanHex = hexString.replace(/\s/g, '').replace(/^0x/, '')

  // 验证是否为有效的十六进制字符串
  if (!/^[0-9A-Fa-f]*$/.test(cleanHex)) {
    throw new Error('Invalid hexadecimal string')
  }

  // 确保十六进制字符串长度为偶数
  const paddedHex = cleanHex.length % 2 === 0 ? cleanHex : '0' + cleanHex

  // 将十六进制字符串转换为字节数组
  const byteArray = []
  for (let i = 0; i < paddedHex.length; i += 2) {
    byteArray.push(parseInt(paddedHex.substr(i, 2), 16))
  }

  // 将字节数组转换为二进制字符串
  const binaryString = byteArray.map(byte => String.fromCharCode(byte)).join('')

  // 使用btoa函数将二进制字符串转换为Base64
  return btoa(binaryString)
}

export function hexToUint8Array(hexString: string) {
  // 移除可能存在的空格或前缀（如0x）
  hexString = hexString.replace(/^0x|\s/g, '')

  // 确保长度为偶数
  if (hexString.length % 2 !== 0) {
    throw new Error('Hex string must have an even length')
  }

  const length = hexString.length / 2
  const array = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    const byteHex = hexString.substr(i * 2, 2)
    array[i] = parseInt(byteHex, 16)
  }

  return array
}

export async function estimateUploadFee(file:AttachmentItem) {
   const chainStore=useChainStore()
 
    
    // 文件大小
    const fileSize = file.size;
    
    // 计算 OP_RETURN 输出大小
    // MetaID 协议：metaid + operation + path + encryption + version + contentType + content
    const path = `/file/${file.fileName}`
    const fileHost = '';
    const finalPath = fileHost ? fileHost + ':' + path : path;
    
    const metadataSize = 6 + 10 + finalPath.length + 10 + 10 + 50; // 粗略估算
    const opReturnSize = OpReturnOverhead + metadataSize + fileSize;
    
    // 总交易大小估算（1个输入，2个输出：找零 + OP_RETURN）
    const estimatedTxSize = BaseSize + InputSize + OutputSize * 2 + opReturnSize;
    
    // 获取费率
    const feeRate = chainStore.mvcFeeRate() || 1;
    
    // 计算费用
    const estimatedFee = Math.ceil(estimatedTxSize * feeRate);
    
    // 添加安全边际（20%）
    const feeWithMargin = Math.ceil(estimatedFee * 1.2);
    
    console.log('预估交易大小:', estimatedTxSize, 'bytes');
    console.log('费率:', feeRate, 'sat/byte');
    console.log('预估费用（含20%边际）:', feeWithMargin, 'satoshis');
    
    return feeWithMargin;
}