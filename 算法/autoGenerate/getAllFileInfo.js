const fs = require('fs');
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
	return fileList
}
function fileInfo(path) {
	var nameReg = /\/([^/]*)\.html/
	//获取名称
	var name = path.match(nameReg)[1]
	const info = fs.statSync(path, { bigint: true })

	//获取时间
	var lastTime = dateFormatter('YYYY.MM.DD',info.atime)
	var birthTime = dateFormatter('YYYY.MM.DD',info.birthtime)
	// console.log('atime',info.atime)
	// console.log('mtime',info.mtime)
	// console.log('ctime',info.ctime)
	// console.log('birthtime',info.birthtime)
	var checkItem = new checkFile(path)
	var importantDate = checkItem.checkDate()
	var jueJin = checkItem.jueJin()
	var biLi= checkItem.biLi()

	// console.log('>>>>>',info.birthTime,importantDate)
	return {
		name,
		path, 
		lastTime,
		birthTime,
		lastTimeMs:parseInt(info.atimeMs),
		birthTimeMs:parseInt(info.birthtimeMs),
		jueJin,
		biLi,
		importantDate
	}
}

// fileInfo('./算法/leetCode/19删除链表的倒数第N个结点.html')

module.exports = treeAndInfo

