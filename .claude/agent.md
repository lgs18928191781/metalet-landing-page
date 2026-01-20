### PinManagement.vue页面修改

1. PinManagement.vue中的table的数据来源于请求metalet-v3.ts中的getPinListByAddreeWithBtc，其中getPinListByAddreeWithBtc的参数params的address为userStore.last.address，如果userStore.last为空时，则直接返回空不需要请求getPinListByAddreeWithBtc了，getPinListByAddreeWithBtc请求成功后响应结果的类型为pinRes，其中pinRes.list的长度如果大于0时，表示有结果，如果等于0或者null，表示没有结果返回了

2. getPinListByAddreeWithBtc的分页逻辑如下
```
getPinListByAddreeWithBtc的parmas中cursor，size初始为cursor=0，size=50,如果getPinListByAddreeWithBtc请求成功返回的pinRes.total大于传入的（cursor+1）* size时，则代表还有下一页内容，否则代表已经没有翻页内容了，而getPinListByAddreeWithBtc的翻页逻辑是

cursor:(currentCursor * size),
size:size
其中currentCursor初始为0，没翻页一次，currentCursor就加1，例如初始请求currentCursor为0，则参数cursor：0 * size ,而翻页则为 1 * size ,如果size为50，则初始为 0，翻页为50，依次类推下一次翻页为 2 * 50  = 100
```

3. PinManagement.vue中的table的数据来源于pinRes.list，其中list中每个item与table如下对应关系
```
PINs:item.id
Value:item.outputValue
ConentType:item.contentType
Content:item.contentSummary
Path:item.path
PinLv:item.popLv

其中PINs的渲染处理成展示前后6位，中间部分用...省略展示，Content展示仅展示前50个字符，剩下用...展示，然后当用户鼠标或者点击Content项的时候，弹出一个prompt，展示全部内容，鼠标移出或者再次点击Content项时，隐藏prompt
```

4. PinManagement.vue中的table的每一项前面都加一个可以让让用户点击的选中框，把用户选中的item放入一个pinList列表中，pinList列表的utxo数据格式为
```
  export interface SelectedUtxo {
    txId: string
    rawTx?: string
    satoshis: number
    confirmed: boolean
    outputIndex: number
   
  }

  rawTx获取通过调用metalet-v3中getUtxoRawTx方法，传入txId:item.id.slice(0,-2)
  const rawTx=await getUtxoRawTx({txId:item.id.slice(0,-2)})
  utxo={
    txId:item.id.slice(0,-2)
    rawTx:rawTx
    satoshis:item.outputValue
    confirmed:true
    outputIndex:item.txIndex
  }

```