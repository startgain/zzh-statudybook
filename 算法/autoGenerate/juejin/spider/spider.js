const cheerio = require("cheerio");
const request = require("request");


function startSpider(url) {
	return new Promise(async (resolve, reject) => {
		try {
			const body = await send(url, "GET", {}, false);
			const $ = cheerio.load(body);
			$("script").map((i, el) => {
				if (!el.attribs.src) {
					let text = $(el)[0].children[0] ? $(el)[0].children[0].data : "";
					// 避免污染全局
					text = `const proxy = arguments[0]; (function(window){${text}})(proxy)`;
					// 代理 window
					let proxy = {};
					const newFunction = new Function(text);
					newFunction(proxy);
					if (proxy.__NUXT__) {
						var res = proxy.__NUXT__.state.view.user.detailList.postList.list.map(function (item) {
							return { url: 'https://juejin.cn/post/' + item.id, title: item.article_info.title }
						})
						resolve(res)
					}
				}
			});
		} catch (error) {
			reject(error);
		}
	})
}

async function send(url, method, formData = {}, json = true) {
	return new Promise((resolve, reject) => {
		request(
			{
				url,
				method,
				json,
				formData,
			},
			async (error, _, body) => {
				if (!error) {
					resolve(body);
				} else {
					reject(error);
				}
			}
		);
	});
}

module.exports = startSpider;
