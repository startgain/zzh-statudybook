const puppeteer = require('puppeteer') 
const fs = require('fs')
//设置网址 
var url = 'https://juejin.cn/user/870468940477240/posts'
async function start(bool) {
	// return
	//启动浏览器,传入headless为false可以打开窗口  
	const browers = await puppeteer.launch({ headless: bool})
	//启动新页面  
	const page = await browers.newPage()
	//设置页面打开时的页面宽度高度  
	await page.setViewport({ width: 1920, height: 1080, })
	//链接网址  
	await page.goto(url)
	var content, $
	await page.evaluate(function () {
		function getJueJinList(){
			var res = window.__NUXT__.state.view.user.detailList.postList.list.map(function(item){
				return {url:'https://juejin.cn/post/'+item.id,title:item.article_info.title}
			})
			// console.log(res)
			//以下是下载json,创建元素      
			var ele = document.createElement('a');
			//设置下载文件名      
			ele.download = "F:\desktop\开课吧\算法\Daydayup\juejin.json";
			//隐藏元素      
			ele.style.display = "none";
			//字符内容转变成blob地址     
			var blob = new Blob([JSON.stringify(res,null,4)], { type: 'text/json' });
			//如果是链接，这里也可以直接设置链接地址     
			ele.href = URL.createObjectURL(blob); 
			document.body.appendChild(ele);
			//模拟点击      
			ele.click();
			//移除元素      
			document.body.removeChild(ele);
		}
		var top = 0
		//每200毫秒滚动100px    
		var scrollY = 0
		var times = 0
		var timer = setInterval(() => {
			console.log(window.scrollY);
			if(scrollY!==window.scrollY){
				times = 0
				scrollY = window.scrollY
			}else{
				times++
				if(times>3){
					clearInterval(timer)
					getJueJinList()
				}
			}
			window.scrollTo(0, top += 1000)
		}, 1000);
	})
}

start(false)