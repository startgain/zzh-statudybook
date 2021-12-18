const fs = require('fs');
const path = require('path');

module.exports = function merge(oldData,newData,filePath) {
	if(!oldData||!newData) return
	var newAdd = []
	var oldMap = {}
	for(var i=0;i<oldData.length;i++){
		var item = oldData[i]
		oldMap[item.url] = true
	}
	newData.forEach(function(item){
		if(!oldMap[item.url]){
			newAdd.push(item)
		}
	})
	var result = [...newAdd,...oldData]
	var stringRes = JSON.stringify(result, null, '\t')
	var filePath = path.join(__dirname, filePath)
	fs.writeFileSync(filePath, stringRes)
	return {newAdd,oldData}
}