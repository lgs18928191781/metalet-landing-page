### PinManagemen.vue修改

1. PinManagemen.vue的melt-btn点击之后打开一个弹窗，并调用useBuildPsbt的estimatedTxFee，获取estimatedTxFee的返回值，melt-confrim-dialog的内容分别渲染
```
输入总金额：total
PIN数量：utxos
矿工费(预估)：estimatedFee
接收BTC：amount
接收地址：recipient
当前费率：feeRate

```
弹窗内容另外给出两个按钮，一个按钮是取消并且关闭弹窗，一个按钮是确认，用户点击确认之后调用useBuildPsbt的buildTx方法

其中调用estimatedTxFee和buildTx的传参如下：
```
 estimatedTxFee({
    utxos:pinListUtxos.value
    buildPsbtParams:{
        amount:new Decimal(selectedBTC).mul(10**8).toNumber()
        recipient:userStore.last.address
    }

 })

 buildTx({
     utxos:pinListUtxos.value
    buildPsbtParams:{
        amount:new Decimal(selectedBTC).mul(10**8).toNumber()
        recipient:userStore.last.address
    }
 })


```

另外有一种情况，如果用户的pinListUtxos中有包含popLv大于等于8的时候，应该先弹窗提示用户你选中的PINs包含等级大于等于8的Pin,你确认继续进行溶解操作？用户点击确认之后再弹窗melt-confrim-dialog

```
输入总金额：total 单位BTC
PIN数量：utxos
矿工费(预估)：estimatedFee 单位BTC
接收BTC：amount 单位BTC
接收地址：recipient
当前费率：feeRate =>单位sat/vB

```

melt-confrim-dialog内容右边显示value和单位