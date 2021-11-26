const fs = require("fs");
const path = require("path");

let readFsync = function (path_way, context = "") {
  //检查文件是否存在于当前目录中
  return new Promise((resolve, reject) => {
    fs.access(path_way, (err) => {
      if (err) {
        console.log("package.json不存在于当前目录中，准备新建");
        fs.appendFileSync(path_way, context, "utf-8", (err) => {
          if (err) {
            console.log("该文件不存在，重新创建失败！");
            reject(err);
          }
          console.log("已新创建");
          resolve(context);
        });
        return;
      }
      //读取文件
      fs.readFile(path_way, "utf8", (err, res) => {
        if (err) {
          console.log("读取失败");
          throw err;
        }
        resolve(res);
        // 默认buffer数据格式，二进制数据流
      });
      console.log("package.json存在于当前目录中");
    });
  });
};

let writeFile = function (path_way, content = "") {
  fs.appendFile(path_way, content, (err) => {
    if(err){
        console.log(err);
    }
    console.log('读取成功')
  });
};

async function start(path_way) {
  const data = await readFsync(path_way);
  const time = new Date();
  const newData = data ? data + "\n" + time : time;
  writeFile(path_way, newData);
}

const filePath = path.join(__dirname, "../../README2.md");

start(filePath);
