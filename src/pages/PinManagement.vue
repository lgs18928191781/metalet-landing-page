<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch,onBeforeUnmount } from 'vue'
import LoginUserOperate from '@/components/LoginUserOperate/LoginUserOperate.vue'
import { useUserStore } from '@/stores/user'
import { getPinListByAddreeWithBtc, getUtxoRawTx, getRatePrice, type pinInfo, type pinRes } from '@/api/metalet-v3'
import { SelectedUtxo } from '@/types/common'
import { useBuildPsbt } from '@/hooks/build-psbt'
import { Decimal } from 'decimal.js'
import { useBtcJsStore } from '@/stores/btcjs'
import * as secp256k1 from 'tiny-secp256k1'
import { toast } from '@/utils/toast'
import { useRootStore } from '@/stores/root'
import { useConnectionStore } from '@/stores/connection'
import { useCredentialsStore } from '@/stores/credentials'
import { useConnectionModal } from '@/hooks/use-connection-modal'
import { useNetworkStore,type Network } from '@/stores/network'
import { sleep ,completeReload} from '@/utils/util'
const userStore = useUserStore()

const btcJsStore = useBtcJsStore()
// 数据状态
const pinList = ref<pinInfo[]>([])
const loading = ref(false)
const currentCursor = ref(0)
const size = ref(50)
const total = ref(0)
const hasMore = ref(false)
const accountInterval=ref()
const rootStore=useRootStore()
const connectionStore=useConnectionStore()
const credentialsStore=useCredentialsStore()
const networkStore = useNetworkStore()
const {  closeConnectionModal } =useConnectionModal()
// 选中状态
const selectedPinIds = ref<Set<string>>(new Set())
const pinListUtxos = ref<SelectedUtxo[]>([])
const contentTooltip = ref<{ id: string; content: string } | null>(null)
const isNetworkChanging = ref(false)

// BTC 价格
const btcPrice = ref<number>(0)
let pricePollingTimer: ReturnType<typeof setInterval> | null = null

// 过滤和排序条件
const filterType = ref<'all' | 'lt8' | 'gte8' | 'sortAsc' | 'sortDesc'>('lt8') // 默认使用 Lv < 8

// 弹窗状态
const showWarningDialog = ref(false) // 警告弹窗（包含高等级 PINs）
const showConfirmDialog = ref(false) // 确认弹窗
const showSuccessDialog = ref(false) // 成功弹窗
const successTxId = ref<string>('') // 成功交易的ID
const meltConfirmData = ref<{
  total: Decimal
  utxos: number
  estimatedFee: Decimal
  amount: Decimal
  recipient: string
  feeRate: number
} | null>(null)
const loadingMelt = ref(false) // 溶解操作加载状态
const MAX_RETRY_TIME = 10000 // 最大等待时间（毫秒）
const RETRY_INTERVAL = 100  // 重试间隔（毫秒）
// useBuildPsbt
const { estimatedTxFee, buildTx } = useBuildPsbt()

// 计算属性
const selectedCount = computed(() => selectedPinIds.value.size)
const selectedBTC = computed(() => {
  return pinListUtxos.value.reduce((sum, utxo) => sum + utxo.satoshis, 0) / 100000000
})
const selectedUSD = computed(() => {
  if (btcPrice.value === 0) return 0
  return selectedBTC.value * btcPrice.value
})

// 过滤和排序后的 PIN 列表
const filteredPinList = computed(() => {
  let result: pinInfo[] = []
  
  // 先过滤
  if (filterType.value === 'all' || filterType.value === 'sortAsc' || filterType.value === 'sortDesc') {
    result = [...pinList.value]
  } else if (filterType.value === 'lt8') {
    result = pinList.value.filter(item => {
      if (item.popLv === null || item.popLv === undefined) return false
      return item.popLv < 8
    })
  } else if (filterType.value === 'gte8') {
    result = pinList.value.filter(item => {
      if (item.popLv === null || item.popLv === undefined) return false
      return item.popLv >= 8
    })
  }
  
  // 再排序
  if (filterType.value === 'sortAsc') {
    // popLv 从低到高排序
    result = [...result].sort((a, b) => {
      const aLv = a.popLv ?? 0
      const bLv = b.popLv ?? 0
      return aLv - bLv
    })
  } else if (filterType.value === 'sortDesc') {
    // popLv 从高到低排序
    result = [...result].sort((a, b) => {
      const aLv = a.popLv ?? 0
      const bLv = b.popLv ?? 0
      return bLv - aLv
    })
  }
  
  return result
})

// 格式化 PIN ID（前后6位，中间...）
const formatPinId = (id: string) => {
  if (!id || id.length <= 12) return id
  return `${id.slice(0, 6)}...${id.slice(-6)}`
}

// 格式化 Content（前50字符，剩余...）
const formatContent = (content: string) => {
  if (!content) return ''
  if (content.length <= 30) return content
  return `${content.slice(0, 30)}...`
}

// 获取 PinLv 标签颜色样式（等级越高，颜色越鲜明）
const getPinLvColorClass = (popLv: number | null | undefined) => {
  if (popLv === null || popLv === undefined) {
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
  }
  
  // 等级越高，颜色越鲜明
  if (popLv >= 9) {
    // 最高等级：金色/紫色
    return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold'
  } else if (popLv >= 7) {
    // 高等级：红色/橙色
    return 'bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold'
  } else if (popLv >= 5) {
    // 中高等级：橙色
    return 'bg-orange-500 text-white font-medium'
  } else if (popLv >= 3) {
    // 中等级：蓝色/绿色
    return 'bg-blue-500 text-white font-medium'
  } else if (popLv >= 1) {
    // 低等级：绿色
    return 'bg-green-500 text-white'
  } else {
    // 默认：灰色
    return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
  }
}

// 获取 PIN 列表数据
const fetchPinList = async (reset = false) => {
  if (!userStore.last || !userStore.last.address) {
    pinList.value = []
    return
  }

  if (reset) {
    currentCursor.value = 0
    pinList.value = []
  }

  loading.value = true
  try {
    const cursor = currentCursor.value * size.value
    const params = {
      address: userStore.last.address,
      cursor,
      size: size.value
    }

    const result: pinRes = await getPinListByAddreeWithBtc(params)
    
    if (result && result.list && result.list.length > 0) {
      // 过滤掉 path 为 /protocols/* 或 /file 的 pinitem
      const filteredList = result.list.filter(item => {
        const path = item.path || ''
        // 过滤掉 /protocols/* 开头的路径
        if (path.startsWith('/info/')) {
          return false
        }
        if (path.startsWith('/ft/mrc20')) {
          return false
        }
        if (path.startsWith('/nft/mrc721')) {
          return false
        }
         if (path.startsWith('/mrc721')) {
          return false
        }
        // 过滤掉 /file 路径
        if (path === '/follow') {
          return false
        }
        return true
      })
      
      if (reset) {
        pinList.value = filteredList
      } else {
        pinList.value = [...pinList.value, ...filteredList]
      }
      total.value = result.total || 0
      
      hasMore.value = result.total > cursor + size.value
    } else {
      if (reset) {
        pinList.value = []
      }
      hasMore.value = false
    }
  } catch (error) {
    console.error('获取 PIN 列表失败:', error)
    if (reset) {
      pinList.value = []
    }
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentCursor.value += 1
    fetchPinList(false)
  }
}

// 刷新数据
const refreshData = () => {
  fetchPinList(true)
}

// 切换选中状态
const toggleSelect = async (item: pinInfo) => {
  const itemId = item.id
  
  if (selectedPinIds.value.has(itemId)) {
    // 取消选中
    selectedPinIds.value.delete(itemId)
    pinListUtxos.value = pinListUtxos.value.filter(utxo => utxo.txId !== item.id.slice(0, -2))
  } else {
    // 选中
    selectedPinIds.value.add(itemId)
    
    try {
      // 获取 rawTx
      const txId = item.id.slice(0, -2)
      const rawTxResult = await getUtxoRawTx({ txId })
      
      const utxo: SelectedUtxo = {
        txId: txId,
        rawTx: rawTxResult.rawTx,
        satoshis: item.outputValue,
        confirmed: true,
        outputIndex: item.txIndex
      }
      
      pinListUtxos.value.push(utxo)
    } catch (error) {
      console.error('获取 rawTx 失败:', error)
      // 即使获取 rawTx 失败，也添加 utxo（rawTx 为可选）
      const utxo: SelectedUtxo = {
        txId: item.id.slice(0, -2),
        satoshis: item.outputValue,
        confirmed: true,
        outputIndex: item.txIndex
      }
      pinListUtxos.value.push(utxo)
    }
  }
}

// 全选/取消全选
const toggleSelectAll = async () => {
  const allSelected = selectedPinIds.value.size === filteredPinList.value.length && filteredPinList.value.length > 0
  
  if (allSelected) {
    // 取消全选
    for (const item of filteredPinList.value) {
      if (selectedPinIds.value.has(item.id)) {
        await toggleSelect(item)
      }
    }
  } else {
    // 全选
    for (const item of filteredPinList.value) {
      if (!selectedPinIds.value.has(item.id)) {
        await toggleSelect(item)
      }
    }
  }
}

// 显示/隐藏 Content 提示框
const toggleContentTooltip = (item: pinInfo) => {
  const content = item.contentSummary || ''
  // 如果内容长度小于等于30，不需要显示提示框
  if (content.length <= 30) {
    return
  }
  
  if (contentTooltip.value?.id === item.id) {
    contentTooltip.value = null
  } else {
    contentTooltip.value = {
      id: item.id,
      content: content
    }
  }
}

// 显示 Content 提示框（鼠标悬停）
const showContentTooltip = (item: pinInfo) => {
  if (item.contentSummary && item.contentSummary.length > 30) {
    contentTooltip.value = {
      id: item.id,
      content: item.contentSummary
    }
  }
}

// 隐藏 Content 提示框（鼠标移出）
const hideContentTooltip = (item: pinInfo) => {
  if (contentTooltip.value?.id === item.id) {
    contentTooltip.value = null
  }
}

// 获取 BTC 价格
const fetchBtcPrice = async () => {
  try {
    const result = await getRatePrice()
    if (result && result.priceInfo && result.priceInfo.btc) {
      btcPrice.value = result.priceInfo.btc
    }
  } catch (error) {
    console.error('获取 BTC 价格失败:', error)
  }
}

// 启动价格轮询
const startPricePolling = () => {
  // 立即获取一次价格
  fetchBtcPrice()
  
  // 每60秒轮询一次
  pricePollingTimer = setInterval(() => {
    fetchBtcPrice()
  }, 60000)
}

// 停止价格轮询
const stopPricePolling = () => {
  if (pricePollingTimer) {
    clearInterval(pricePollingTimer)
    pricePollingTimer = null
  }
}


async function connectMetalet() {

  try {
    const connection = await connectionStore.connect('metalet').catch((err) => {
         toast.error('最大允许溶解100个PIN,请检查后重试')(err.message)
   
  })
    if (connection?.status === 'connected') {
    await credentialsStore.login()

  }
  } catch (error) {
     toast.error((error as any).message,)
  }

    

}


function handleNetworkChanged(network: Network) {
isNetworkChanging.value = true

const appNetwork = networkStore.network
if (network !== appNetwork) {
connectionStore.disconnect()
}

isNetworkChanging.value = false
}

const metaletAccountsChangedHandler = () => {
try {
  
if (useConnectionStore().last.wallet !== 'metalet') return
if(rootStore.isWebView) return
connectionStore.disconnect()

toast.warning('Metalet 账户已变更。正在刷新页面...')
sleep().then(()=>completeReload())


} catch (error) {
console.error('Error in metaletAccountsChangedHandler:', error)
}
}




const metaletNetworkChangedHandler = (network: Network) => {
if (useConnectionStore().last.wallet !== 'metalet') return
if(rootStore.isWebView) return
handleNetworkChanged(network)
}

const appLoginSuccessHandler= async (data: any) => {

try {

if (!userStore.isAuthorized) {
await connectMetalet()


}

} catch (error) {
  toast.error(error as any)

}
}




const appAccountSwitchHandler= async(data:any)=>{
//ElMessage.success('调用onAccountSwitch')
try {
if(rootStore.isWebView){

await connectionStore.disconnect()

await connectMetalet()


}
} catch (error) {
throw new Error(error as any)
}
}

const appLogoutHandler= async (data: any) => {
try {
console.log("退出登录成功", data)
if (userStore.isAuthorized) {
await connectionStore.disconnect()
closeConnectionModal()
}
} catch (error) {
console.error('Error in Logout handler:', error)
}
}


// 监听用户信息变化
watch(() => userStore.last?.address, (newAddress) => {
  if (newAddress) {
    fetchPinList(true)
  } else {
    pinList.value = []
    selectedPinIds.value.clear()
    pinListUtxos.value = []
  }
}, { immediate: true })

// 组件挂载时获取数据
onMounted(() => {
  if (userStore.last?.address) {
    fetchPinList(true)
  }
  // 启动价格轮询
  startPricePolling()

  // initialize btcjs
  if (window.bitcoinjs) {
    const btcjs = window.bitcoinjs
    btcJsStore.set(btcjs)
  }

  // initialize related btc modules
  if (window.ecpair && window.ecpair.ECPairFactory) {
    const ECPair = window.ecpair.ECPairFactory(secp256k1)
    btcJsStore.setECPair(ECPair)
  } else {
    console.warn('window.ecpair is not available, ECPair initialization skipped')
  }


  let retryCount = 0
  let timeoutId: NodeJS.Timeout | undefined
  //document.addEventListener('visibilitychange', handleVisibilityChange);
 
      accountInterval.value = setInterval(async () => {
    try {
       rootStore.checkWebViewBridge()

        if (!userStore.isAuthorized) {
     
        if(rootStore.isWebView){
        await connectMetalet()
        }
        }

       if(rootStore.isWebView) return
       
      if (window.metaidwallet && connectionStore.last.status == 'connected' && userStore.isAuthorized) {
        const res = await window.metaidwallet.getAddress()

        if ((res as any)?.status === 'not-connected' || userStore.last?.address !== res) {
          connectionStore.disconnect()
          toast.warning('Metalet 账户已变更')
        }
      }
    } catch (error) {
      console.error('Error checking account status:', error)
    }
  }, 2 * 1000)
  







  const checkMetalet =  () => {
    rootStore.checkWebViewBridge()
    if (window.metaidwallet) {
      
      try {
          
        ;(window.metaidwallet as any)?.on('accountsChanged',metaletAccountsChangedHandler)
        ;(window.metaidwallet as any)?.on('networkChanged',metaletNetworkChangedHandler)

        ;(window.metaidwallet as any)?.on('LoginSuccess',appLoginSuccessHandler)




        ;(window.metaidwallet as any)?.on('onAccountSwitch',appAccountSwitchHandler)



        ;(window.metaidwallet as any)?.on('Logout',appLogoutHandler)

      } catch (err) {
        
        console.error('Failed to setup Metalet listeners:', err)
      }
    } else if (retryCount * RETRY_INTERVAL < MAX_RETRY_TIME) {
      
      retryCount++
      timeoutId = setTimeout(checkMetalet, RETRY_INTERVAL)
    } else {
      
      console.warn('Metalet wallet not detected after timeout')
    }
  }

  // 初始检查
  checkMetalet()



  if(window.metaidwallet && connectionStore.last.status == 'connected' && userStore.isAuthorized){
      rootStore.checkBtcAddressSameAsMvc().then().catch(()=>{
            toast.warning('Metalet BTC当前地址与MVC地址不一致，请切换BTC地址与MVC地址一致后再进行使用')
              setTimeout(() => {
                 connectionStore.disconnect()
              }, 3000);

        })



  }


  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })




})


onBeforeUnmount(async () => {
  // remove event listener
  try {
    ;(window.metaidwallet as any)?.removeListener(
      'accountsChanged',
      metaletAccountsChangedHandler,
    )
    ;(window.metaidwallet as any)?.removeListener(
      'networkChanged',
      metaletNetworkChangedHandler,
    )

    ;(window.metaidwallet as any)?.removeListener('LoginSuccess',appLoginSuccessHandler)
    ;(window.metaidwallet as any)?.removeListener('Logout',appLogoutHandler)
  
    ;(window.metaidwallet as any)?.removeListener(
    'onAccountSwitch',
    appAccountSwitchHandler

    )
  

    clearInterval(accountInterval.value)
  } catch (error) {
    console.error('Error removing event listeners:', error)
  }
})

// 检查选中的 PINs 中是否有 popLv >= 8 的
const hasHighLevelPins = computed(() => {
  return pinList.value.some(item => 
    selectedPinIds.value.has(item.id) && 
    item.popLv !== null && 
    item.popLv !== undefined && 
    item.popLv >= 8
  )
})

// 处理 Melt PINs 按钮点击
const handleMeltPins = async () => {
  if (selectedCount.value < 3 || selectedCount.value > 100) {
     toast.warning('最大允许溶解100个PIN,请检查后重试')
    return
  }

  // 如果包含高等级 PINs，先显示警告弹窗
  if (hasHighLevelPins.value) {
    showWarningDialog.value = true
    return
  }

  // 否则直接显示确认弹窗
  await showMeltConfirmDialog()
}

// 显示确认弹窗
const showMeltConfirmDialog = async () => {
  try {
    loadingMelt.value = true
    const result = await estimatedTxFee({
      utxos: pinListUtxos.value,
      buildPsbtParams: {
        amount: new Decimal(selectedBTC.value).mul(10 ** 8),
        recipient: userStore.last?.address || ''
      }
    })

    meltConfirmData.value = {
      total: result.total,
      utxos: result.utxos.length,
      estimatedFee: result.estimatedFee,
      amount: result.amount,
      recipient: result.recipient,
      feeRate: result.feeRate
    }
    showConfirmDialog.value = true
  } catch (error) {
    console.error('获取预估费用失败:', error)
    // TODO: 显示错误提示
  } finally {
    loadingMelt.value = false
  }
}

// 确认警告弹窗
const confirmWarning = async () => {
  showWarningDialog.value = false
  await showMeltConfirmDialog()
}

// 取消警告弹窗
const cancelWarning = () => {
  showWarningDialog.value = false
}

// 确认溶解操作
const confirmMelt = async () => {
  if (!meltConfirmData.value) return

  try {
    loadingMelt.value = true
    const res = await buildTx({
      utxos: pinListUtxos.value,
      buildPsbtParams: {
        amount: new Decimal(selectedBTC.value).mul(10 ** 8),
        recipient: userStore.last?.address || ''
      }
    })
    
    // 如果返回值不为空，代表溶解成功
    if (res) {
      // 关闭确认弹窗
      showConfirmDialog.value = false
      meltConfirmData.value = null
      
      // 显示成功弹窗
      successTxId.value = res
      showSuccessDialog.value = true
      
      // 刷新数据
      refreshData()
    }
  } catch (error) {
    console.error('溶解操作失败:', error)
    // TODO: 显示错误提示
  } finally {
    loadingMelt.value = false
  }
}

// 取消确认弹窗
const cancelMelt = () => {
  showConfirmDialog.value = false
  meltConfirmData.value = null
}

// 关闭成功弹窗
const closeSuccessDialog = () => {
  showSuccessDialog.value = false
  successTxId.value = ''
}

// 查看交易详情
const viewTransaction = () => {
  if (successTxId.value) {
    window.open(`https://mempool.space/zh/tx/${successTxId.value}`, '_blank')
  }
}

// 跳转到首页
const goToHome = () => {
  window.location.href = '/'
}

// 组件卸载时清理定时器
onUnmounted(() => {
  stopPricePolling()
})
</script>

<template>
  <div class="pin-management-page w-full bg-[#F5F7F9]">
    <!-- 自定义 Header -->
    <header class="custom-header w-full px-5 pb-4 flex items-center justify-between bg-[#F5F7F9]   dark:border-gray-700">
      <div class="flex logo items-center gap-x-1 cursor-pointer" @click="goToHome">
        <img src="/metalet.svg" class="w-[30px]" alt="Metalet" />
        <span class="text-[20px] font-bold">Metalet</span>
      </div>
      <div class="user-section flex items-center">
        <LoginUserOperate />
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="container mx-auto px-5 py-8 pb-2">
      <!-- 标题区域 -->
      <div class="text-center mb-8 relative">
      
        
        <h1 class="pin-management-slogan text-4xl md:text-5xl font-bold mb-4 relative z-10">
          Pin Management
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-2">
          After melting the PINs, any assets within them will be treated as BTC.
          <!-- <a href="#" class="text-blue-500 underline ml-1 hover:text-blue-600">FAQ</a> -->
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          The list only displays PINs other than those from <span class="highlight-gradient">MRC20</span>, <span class="highlight-gradient">MRC721</span>, and <span class="highlight-gradient">Info</span> nodes, to avoid accidentally dissolving critical PINs.
        </p>
      </div>

      <!-- Useless Inscriptions UTXOs 卡片 -->
      <!-- <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Useless Inscriptions UTXOs
            </h2>
            <button class="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600">
              <span class="text-xs">?</span>
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">UTXO Count</p>
              <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ uselessInscriptionsCount }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-500 dark:text-gray-400">UTXO Value</p>
              <div class="flex items-center gap-2">
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ uselessInscriptionsValue }} BTC
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  ${{ uselessInscriptionsValueUSD }}
                </p>
                <button @click="refreshData" class="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- UTXO List 区域 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <!-- 标签页和操作栏 -->
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-4">
            <button class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400">
              BTC
            </button>
            <!-- <button class="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              All UTXOs
            </button> -->
          </div>
          
          <div class="flex items-center gap-3 drop-menu">
            <select 
              v-model="filterType"
              class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All PINs</option>
              <option value="lt8">popLv &lt; 8</option>
              <option value="gte8">popLv &gt;= 8</option>
              <option value="sortAsc">popLv 从低到高</option>
              <option value="sortDesc">popLv 从高到低</option>
            </select>
            <button @click="refreshData" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 列表标题 -->
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            PINs List ({{ filteredPinList.length }})
          </h3>
     
        </div>

        <!-- 表格 -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-12">
                  <input 
                    type="checkbox" 
                    class="rounded border-gray-300"
                    :checked="selectedPinIds.size === filteredPinList.length && filteredPinList.length > 0"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">PINs</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Value</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">ConentType</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Content</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">PinLv</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Path</th>
              </tr>
            </thead>
            <tbody>
              <!-- 加载状态 -->
              <tr v-if="loading && pinList.length === 0">
                <td colspan="7" class="py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                    <p class="text-gray-500 dark:text-gray-400">Loading...</p>
                  </div>
                </td>
              </tr>
              
              <!-- 数据行 -->
              <tr 
                v-for="item in filteredPinList" 
                :key="item.id"
                class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td class="py-3 px-4">
                  <input 
                    type="checkbox" 
                    class="rounded border-gray-300"
                    :checked="selectedPinIds.has(item.id)"
                    @change="toggleSelect(item)"
                  />
                </td>
                <td class="py-3 px-4 text-sm text-gray-900 dark:text-white font-mono">
                  {{ formatPinId(item.id) }}
                </td>
                <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {{ item.outputValue }} Sats
                </td>
                <td class="py-3 px-4 text-sm text-gray-900 dark:text-white">
                  {{ item.contentType || '-' }}
                </td>
                <td 
                  class="py-3 px-4 text-sm text-gray-900 dark:text-white relative"
                  :class="{ 'cursor-pointer': (item.contentSummary || '').length > 30 }"
                  @click="toggleContentTooltip(item)"
                  @mouseenter="showContentTooltip(item)"
                  @mouseleave="hideContentTooltip(item)"
                >
                  <span>{{ formatContent(item.contentSummary || '') }}</span>
                  <!-- 提示框 -->
                  <div 
                    v-if="contentTooltip?.id === item.id && contentTooltip.content"
                    class="absolute z-50 left-0 top-full mt-2 p-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg max-w-md break-words whitespace-pre-wrap"
                    @click.stop
                    @mouseenter.stop
                    @mouseleave="contentTooltip = null"
                  >
                    {{ contentTooltip.content }}
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span 
                    v-if="item.popLv !== null && item.popLv !== undefined"
                    :class="getPinLvColorClass(item.popLv)"
                    class="inline-flex items-center font-bold px-2.5 py-0.5 rounded-full text-xs "
                  >
                    Lv.{{ item.popLv }}
                  </span>
                  <span v-else class="text-sm text-gray-500 dark:text-gray-400">-</span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-900 dark:text-white font-mono">
                  {{ item.path || '-' }}
                </td>
              </tr>
              
              <!-- 空状态 -->
              <tr v-if="!loading && filteredPinList.length === 0">
                <td colspan="7" class="py-12 text-center">
                  <div class="flex flex-col items-center justify-center">
                    <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p class="text-gray-500 dark:text-gray-400">No data</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- 加载更多按钮 -->
          <div v-if="hasMore && !loading" class="mt-4 text-center">
            <button 
              @click="loadMore"
              class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Load More
            </button>
          </div>
          
          <!-- 加载中提示 -->
          <div v-if="loading && filteredPinList.length > 0" class="mt-4 text-center">
            <p class="text-gray-500 dark:text-gray-400">Loading more...</p>
          </div>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-5 py-4 flex items-center justify-between z-50">
        <div class="text-sm text-gray-600 dark:text-gray-400 melt-intro">
          <div class="font-bold text-base">Selected: {{ selectedCount }} PINs | {{ selectedBTC }} BTC (${{ selectedUSD.toFixed(2) }})</div>
          <div class="text-xs text-orange-600 dark:text-orange-400 mt-1">
            仅支持3个以上或100个以下PIN进行溶解操作，请务必谨慎检查要溶解的选项中是否包含Pin等级大于等于8
          </div>
        </div>
        <div class="flex items-center gap-3 btn-op-group">
          <!-- <button class="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors shadow-sm">
            Split BTC
          </button>
          <button class="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors shadow-sm">
            Merge BTC
          </button> -->
          <button 
            @click="handleMeltPins"
            :disabled="selectedCount < 3 || selectedCount > 100 || loadingMelt"
            class="px-6 py-2.5 melt-btn bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            {{ loadingMelt ? 'Processing...' : 'Melt PINs' }}
          </button>
        </div>
      </div>
    </main>

    <!-- 警告弹窗 -->
    <div 
      v-if="showWarningDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="cancelWarning"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          警告
        </h3>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          你选中的PINs包含等级大于等于8的Pin，你确认继续进行溶解操作？
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="cancelWarning"
            class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmWarning"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 确认弹窗 -->
    <div 
      v-if="showConfirmDialog && meltConfirmData"
      class="fixed inset-0 bg-black bg-opacity-50 melt-detail-dialog flex items-center justify-center z-50"
      @click.self="cancelMelt"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 relative">
        <button
          @click="cancelMelt"
          :disabled="loadingMelt"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="关闭"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="mb-6 pr-8">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            确认溶解操作
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            请仔细核对以下信息，确认无误后点击确认按钮
          </p>
        </div>
        
        <div class="space-y-1 mb-8 melt-confirm-dialog">
          <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400 font-medium">输入总金额</span>
            <div class="text-right">
              <span class="text-gray-900 dark:text-white font-semibold text-lg">
                {{ new Decimal(meltConfirmData.total).div(10 ** 8).toFixed(8) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">BTC</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400 font-medium">PIN数量</span>
            <div class="text-right">
              <span class="text-gray-900 dark:text-white font-semibold text-lg">{{ meltConfirmData.utxos }}</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400 font-medium">矿工费(预估)</span>
            <div class="text-right">
              <span class="text-gray-900 dark:text-white font-semibold text-lg">
                {{ new Decimal(meltConfirmData.estimatedFee).div(10 ** 8).toFixed(8) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">BTC</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span class="text-gray-600 dark:text-gray-400 font-medium">接收BTC</span>
            <div class="text-right">
              <span class="text-green-600 dark:text-green-400 font-semibold text-lg">
                {{ new Decimal(meltConfirmData.amount).div(10 ** 8).toFixed(8) }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">BTC</span>
            </div>
          </div>
          
          <div class="py-3 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-start mb-2">
              <span class="text-gray-600 dark:text-gray-400 font-medium">接收地址</span>
            </div>
            <div class="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <span class="text-gray-900 dark:text-white font-mono text-sm break-all block text-right">
                {{ meltConfirmData.recipient }}
              </span>
            </div>
          </div>
          
          <div class="flex justify-between items-center py-3">
            <span class="text-gray-600 dark:text-gray-400 font-medium">当前费率</span>
            <div class="text-right">
              <span class="text-gray-900 dark:text-white font-semibold text-lg">
                {{ meltConfirmData.feeRate }}
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">sat/vB</span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="cancelMelt"
            :disabled="loadingMelt"
            class="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
          >
            取消
          </button>
          <button
            @click="confirmMelt"
            :disabled="loadingMelt"
            class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
          >
            {{ loadingMelt ? '处理中...' : '确认溶解' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 成功弹窗 -->
    <div 
      v-if="showSuccessDialog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeSuccessDialog"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 relative">
        <button
          @click="closeSuccessDialog"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="关闭"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="text-center">
          <div class="mb-4 text-6xl">🎉</div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            溶解成功！
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            您的PINs已成功溶解，交易已提交到区块链网络
          </p>
          
          <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">交易ID</p>
            <p class="text-sm text-gray-900 dark:text-white font-mono break-all">
              {{ successTxId }}
            </p>
          </div>
          
          <div class="flex justify-center gap-3">
            <button
              @click="closeSuccessDialog"
              class="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              关闭
            </button>
            <button
              @click="viewTransaction"
              class="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-md hover:shadow-lg"
            >
              查看交易详情
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pin-management-page {
  padding-bottom: 50px; /* 为底部操作栏和 footer 留出空间 */
  background-color: #F5F7F9;
  min-height: calc(100vh - 50px); /* 确保内容区域有足够高度，但为 footer 留出空间 */
}

.container {
  max-width: 1200px;
}

/* 确保页面背景色 */
:deep(body) {
  background-color: #F5F7F9;
}

/* Pin Management Slogan 蓝紫色渐变效果 */
.pin-management-slogan {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 25%, #7c3aed 50%, #8b5cf6 75%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  line-height: 1.3;
  padding-top: 0.2em;
  padding-bottom: 0.3em;
  display: inline-block;
  /* 轻微的3D透视效果 */
  transform: perspective(800px) rotateX(2deg);
  /* 柔和的发光效果 */
  filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.4)) drop-shadow(0 0 30px rgba(124, 58, 237, 0.3));
}

/* 关键词高亮渐变效果 */
.highlight-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 25%, #7c3aed 50%, #8b5cf6 75%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
  display: inline-block;
}

/* 移动端 custom-header 样式 */
@media (max-width: 500px) {
  .custom-header {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}






</style>
