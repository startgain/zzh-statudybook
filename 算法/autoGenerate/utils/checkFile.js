const fs = require('fs');
class checkFile {
	constructor(filePath) {
		this.fileContent = fs.readFileSync(filePath, "utf8")
		this.regList = {
			importantDateReg: /<\!-- (日期:(.*)) -->/,
			juejinReg: /<\!-- (\[掘金\](.*)) -->/,
			biLiReg: /<\!-- (\[b站\](.*)) -->/
		}
	}
	showContent() {
		return this.fileContent
	}
	checkDate() {
		if (!this.fileContent) {
			return
		}
		var fileContent = this.fileContent
		var reg = this.regList.importantDateReg
		var importantDate = fileContent.match(reg) && fileContent.match(reg)[2]
		return importantDate
	}
	jueJin() {
		if (!this.fileContent) {
			return
		}
		var fileContent = this.fileContent
		var reg = this.regList.biLiReg
		var jueJin = fileContent.match(reg) && fileContent.match(reg)[1]
		return jueJin
	}
	biLi() {
		if (!this.fileContent) {
			return
		}
		var fileContent = this.fileContent
		var reg = this.regList.juejinReg
		var bili = fileContent.match(reg) && fileContent.match(reg)[1]
		return bili
	}
}
module.exports = checkFile;