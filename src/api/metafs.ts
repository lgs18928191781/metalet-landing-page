import { HttpRequest } from '@/utils/http'
import { useConfig } from '@/hooks/use-config';

const {
  metaFsUrl
} = useConfig();


export interface MetaFileInfo{
    pin_id: string,
    tx_id: string,
    path: string,
    operation: string,
    encryption: string,
    content_type: string,
    file_type: string,
    file_extension: string,
    file_name: string,
    file_size: number,
    file_md5: string,
    file_hash: string,
    storage_path: string,
    chain_name: string,
    block_height: number,
    timestamp: number,
    creator_meta_id: string,
    creator_address:string,
    owner_meta_id:string,
    owner_address:string
}


// 创建 MAN API 实例，配置自定义响应处理
const metafsApiInstance = new HttpRequest(
  `${metaFsUrl.value}/api` || 'https://file.metaid.io/metafile-indexer/api',
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
const metafsApi = {
  get: metafsApiInstance.get.bind(metafsApiInstance),
  post: metafsApiInstance.post.bind(metafsApiInstance),
  put: metafsApiInstance.put.bind(metafsApiInstance),
  delete: metafsApiInstance.delete.bind(metafsApiInstance),
}

export interface ChatUserInfo{

address:string
avatar:string
avatarImage:string
chatPublicKey:string
chatPublicKeyId:string
metaid:string
name:string
}




export interface UserInfo {
  address: string
  avatar: string
  avatarPinId: string
  blockHeight: string
  timestamp: number
  chainName: string
  namePinId: string
  metaId: string
  globalMetaId:string
  name: string
  nameId: string
  chatpubkey?:string
  chatPublicKeyPinId?:string
}

export const getUserInfoByAddressByMs = async (address: string): Promise<UserInfo> => {
  

  return metafsApi.get(`/v1/users/address/${address}`).then(res => {
   
    
    return res
  })
}


export const getMetaFileInfo = async (pinid: string): Promise<MetaFileInfo> => {
  

  return metafsApi.get(`/v1/files/${pinid}`).then(res => {
   
    
    return res
  })
}


