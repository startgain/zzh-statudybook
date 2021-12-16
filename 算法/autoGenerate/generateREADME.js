const getFileInfo = require("./getAllFileInfo")
const fs = require("fs")

const allFillInfo = getFileInfo('算法/leetCode')
var fileContent = fs.readFileSync('README.md', "utf8")
// console.log(fileContent)
function generatorMd(fileData){
	console.log(fileData)
	fileData.sort((a,b)=>b.birthTimeMs-a.birthTimeMs)
	if(!fileData) return
	var baseTemp = "# zzh-statudybook \n \n## 日志 \n- 算法学习\n"
	var itemTemp = ''
	fileData.forEach(item=>{
		var itemTempBase = `	- ${item.birthTime} ${item.name}\n		- [代码](https://github.com/startgain/zzh-statudybook/blob/main/${encodeURI(item.path)})\n		- [掘金]()\n		- [b站]()\n`
		//拼接文件模板详情
		itemTemp+=itemTempBase
		
	})
	fs.writeFileSync('README3.md', baseTemp+itemTemp)
}

generatorMd(allFillInfo)