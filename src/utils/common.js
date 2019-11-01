const path = require('path');
const fs = require('fs');
const nunjucks = require('nunjucks');

nunjucks.configure(path.join(__dirname, '../tpl'),{ autoescape: true });

module.exports = {
  tpl: nunjucks.render,
  writeFile: (fileName, content) => {
    mkdirsSync(path.dirname(fileName));
    fs.writeFileSync(fileName, content, 'utf8');
  },
  toUpperFirstCase: (str) => {
    if (!str) {
      return str;
    }
    return str[0].toUpperCase() + str.substring(1);
  },
  mkdirsSync,
  rmDirsSync,
};

function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  }
  if (mkdirsSync(path.dirname(dirname))) {
    fs.mkdirSync(dirname);
    return true;
  }
}

function rmDirsSync(filePath){
  if (!fs.existsSync(filePath)) {
    return;
  }
  const info = fs.statSync(filePath);
  if(info.isFile()){
    fs.unlinkSync(filePath); //删除文件
  } else {
    const dirs = fs.readdirSync(filePath);
    for (let dir of dirs) {
      rmDirsSync(path.join(filePath, dir)); //递归删除
    }
    fs.rmdirSync(filePath); //删除目录
  }
}
