const fs = require('fs');
const path = require('path');
const dateFormatter = require('./utils/dateFormatter');
const checkFile = require('./utils/checkFile');

//打印目录结构 获取文件信息
function treeAndInfo(path, num) {
	var catalogue = []
	num = num ? num : 1;
	let str = '';
	for (var i = 0; i < num - 1; i++) {
		str += '|   '
	}
	str += '|-'
	//获取所有当前路径下所有子路径
	const res = fs.readdirSync(path)
	//文件夹数组
	var dirList = []
	var fileList = []
	//遍历所有子路径
	res.forEach((item, index) => {
		if (['.git', 'node_modules'].includes(item)) return
		var stats = fs.statSync(path + '/' + item)
		let isFile = stats.isFile();
		if (isFile) {
			//文件目录
			catalogue.push(str + item)
			fileList.push({ path: path + '/' + item })
		} else {
			var dirItem = { path: path + '/' + item, num: num + 1, name: item }
			dirList.push(dirItem)
		}

	})
	//路径信息转为文件详细信息
	fileList = fileList.map((item, index) => {
		return fileInfo(item.path)
	})
	//遍历所有子路径中的文件夹
	dirList.forEach((item, index) => {
		const { name, path, num } = item
		//文件夹目录
		catalogue.push(str + name)
		const fileItemList = treeAndInfo(path, num)
		fileList = [...fileList, ...fileItemList]
	})
	// console.log(fileList)
	fileList.sort((a,b)=>{
		var aDate = a.importantDate.split('.').join('')
		var bDate = b.importantDate.split('.').join('')
		return bDate - aDate
	})
	return fileList
}
function fileInfo(filePath) {
	var nameReg = /\/([^/]*)\.html/
	//获取名称
	var name = filePath.match(nameReg)[1]
	const info = fs.statSync(filePath, { bigint: true })

	//获取时间
	var lastTime = dateFormatter('YYYY.MM.DD',info.atime)
	var birthTime = dateFormatter('YYYY.MM.DD',info.birthtime)
	//固话日期 有则跳过无则添加
	fixedDate(filePath,birthTime)
	// console.log('atime',info.atime)
	// console.log('mtime',info.mtime)
	// console.log('ctime',info.ctime)
	// console.log('birthtime',info.birthtime)
	var checkItem = new checkFile(filePath)
	var importantDate = checkItem.checkDate()
	var jueJin = checkItem.jueJin()
	var biLi= checkItem.biLi()

	// console.log('>>>>>',info.birthTime,importantDate)
	return {
		name,
		path:filePath, 
		lastTime,
		birthTime,
		lastTimeMs:parseInt(info.atimeMs),
		birthTimeMs:parseInt(info.birthtimeMs),
		jueJin,
		biLi,
		importantDate
	}
}

//日期固化
function fixedDate(filePath,date){
	//判断是否有固化日期 有直接return
	var filePath = path.join(__dirname,'../../'+filePath)
	const checkItem = new checkFile(filePath)
	var hasDate = checkItem.checkDate()
	if(!hasDate){
		const old =checkItem.showContent()
		const newCon = `<!-- 日期:${date} -->\n`+old
		fs.writeFileSync(filePath,newCon,(err,res)=>{
			if(err) return
			console.log('日期固化成功')
		})
	}

	//读取文件创建日期

	//固化到文件当中
}

// fileInfo('./算法/leetCode/19删除链表的倒数第N个结点.html')

module.exports = treeAndInfo

