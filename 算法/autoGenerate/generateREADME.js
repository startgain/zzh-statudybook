const getFileInfo = require("./getAllFileInfo")
const fs = require("fs")
const path = require("path")
const checkFile = require('./utils/checkFile');
//补丁map表 替换名称
const replaceMap = require("./utils/replaceVal")
const replacejj = replaceMap.juejin
const replacebl = replaceMap.bili

//所有本地文件信息
const allFillInfo = getFileInfo('算法/leetCode')
// console.log('allFillInfo>>>',allFillInfo)
var juejinData = require("./juejin/jsonData/juejin.json")
var bilibiliData = require("./bilibili/jsonData/bilibili.json")
// console.log('juejinData的长度',juejinData.length)
// console.log('bilibiliData',bilibiliData.length)
var jjss = 0
var blss = 0
var ss = []
function findAddress(data, name, from) {
	var res = data.find(item => {
		var prefix = ''
		if (from === 'bl') {
			var prefix = '程序员必刷算法题：'
			name = replacebl[name]?replacebl[name]:name
			return (item.title === prefix + name) || item.title === name
		} else {
			prefix = '[路飞]_程序员必刷力扣题: '
			name = replacejj[name]?replacejj[name]:name
			return (item.title.trim() === prefix + name) || item.title.trim() === name || item.title.trim().endsWith(name)
		}
	})
	var resIndex = data.findIndex(item => {
		var prefix = ''
		if (from === 'bl') {
			var prefix = '程序员必刷算法题：'
			return (item.title === prefix + name) || item.title === name
		} else {
			prefix = '[路飞]_程序员必刷力扣题: '
			if(name === 'k个一组翻转链表'){
				name = 'K 个一组翻转链表'
			}
			return (item.title.trim() === prefix + name) || item.title.trim() === name || item.title.trim().endsWith(name)
		}
	})
	var result = res ? res.url : ''
	if (from === 'jj' && result) {
		ss.push('[路飞]_程序员必刷力扣题: ' + name)
		data.splice(resIndex, 1)
		jjss++
	}
	if (from === 'bl' && result) {
		// ss.push('程序员必刷算法题：' + name)
		// data.splice(resIndex, 1)
		blss++
	}
	return result
}
function generatorMd(fileData) {
	if (!fileData) return
	var baseTemp = "# zzh-statudybook \n \n## 日志 \n- 算法学习\n"
	var itemTemp = ''
	fileData.forEach(item => {
		//初始化文件的固化日期
		fixedDate(item.path,item.birthTime)
		//日期固化优先级>文件创建日期
		var date = `	- ${item.importantDate ? item.importantDate : item.birthTime} ${item.name}\n`
		var gitCode = `		- [代码](https://github.com/startgain/zzh-statudybook/blob/main/${encodeURI(item.path)})\n`
		var jjAddress = findAddress(juejinData, item.name, 'jj')
		var juejin = `		- [掘金](${jjAddress})\n`
		var blAddress = findAddress(bilibiliData, item.name, 'bl')
		var bilibili = `		- [b站](${blAddress})\n`
		var itemTempBase = date + gitCode + (jjAddress ? juejin : '') + (blAddress ? bilibili : '')
		// console.log('>>>',itemTempBase)
		//拼接文件模板详情
		itemTemp += itemTempBase
	})
	// console.log('jjss', jjss)
	// console.log('blss', blss)
	// console.log('fail', juejinData.length, juejinData)
	// console.log('fail', bilibiliData.length, bilibiliData)
	fs.writeFileSync(path.join(__dirname,'../../README.md') , baseTemp + itemTemp)
	console.log('README.md文件生成成功！！！')
}

//日期固化
function fixedDate(filePath,date){
	// console.log(filePath,'============',date)
	//判断是否有固化日期 有直接return
	var filePath = path.join(__dirname,'../../'+filePath)
	const checkItem = new checkFile(filePath)
	var hasDate = checkItem.checkDate()
	if(!hasDate){
		console.log(hasDate)
		const old =checkItem.showContent()
		const newCon = `<!-- 日期:${date} -->\n`+old
		fs.writeFile(filePath,newCon,(err,res)=>{
			if(err) return
			console.log('日期固化成功')
		})
	}

	//读取文件创建日期

	//固化到文件当中
}

generatorMd(allFillInfo)