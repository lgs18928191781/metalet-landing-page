import {type Network } from '@/stores/network'

export const SIGNING_MESSAGE =import.meta.env.VITE_APP_NAME
export const NETWORK: Network = import.meta.env.VITE_NET_WORK_NEW || 'livenet'
export const BaseSize=200 // 基础交易开销
export const InputSize=150 // 每个输入大小（含签名）
export const OutputSize=34 // 每个输出大小
export const OpReturnOverhead=50 // OP_RETURN 脚本开销