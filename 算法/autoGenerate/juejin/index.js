const spiderJuejin = require("./spider/spider.js");
const oldData = require("./jsonData/juejin.json");
const merge = require("./utils/merge")
spiderJuejin("https://juejin.cn/user/870468940477240/posts").then(res=>{
	var res  = merge(oldData, res,'../jsonData/juejin.json')
	console.log(`掘金原有数据${res.oldData.length}条,新增${res.newAdd.length}条`)
})

