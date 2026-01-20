1. PinManagement.vue的获取const result: pinRes = await getPinListByAddreeWithBtc(params)时，应该过滤掉path为非/protocols/*或者/file的pinitem

2. 在After melting the PINs, any assets within them will be treated as BTC.下面给出一个提示，The list only displays PINs other than those from MRC20, MRC721, and Info nodes, to avoid accidentally dissolving critical PINs.