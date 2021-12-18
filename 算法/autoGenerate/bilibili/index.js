const spider = require('./spider/spider');
const fs = require('fs');
const path = require('path');

const bilibiliSpider = new spider()
//我的b站地址
async function start() {
	var res = await bilibiliSpider.fetchData({ url: 'https://space.bilibili.com/316534249' })
	// console.log(res)
	var stringRes = JSON.stringify(res, null, '\t')
	var filePath = path.join(__dirname, './jsonData/bilibili.json')
	fs.writeFileSync(filePath, stringRes)
	console.log(`B站共抓取${res.length}条数据`)
}
start()