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
  digestOpt,
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

/**
 * 解析形如{'a.b': 1, 'a.c': 2} 为 { a: { b: 1, c: 2 } }
 * @param {*} data 
 */
function digest(data) {
  if (typeof(data) !== 'object' || data === null) {
    return data;
  }
  const res = Array.isArray(data) ? [] : {};
  Object.entries(data).map(([key, value]) => {
    const idx = key.indexOf('.');
    if (idx === -1) {
      res[key] = digest(value);
    } else {
      const a = key.substr(0, idx);
      const b = key.substr(idx + 1);
      res[a] = digest({
        ...(res[a] || {}),
        [b]: value
      })
    }
  });
  return res;
}

function stringifyMock(obj, spaceCount = 0) {
  const space = ' '.repeat(spaceCount);

  let res = '';
  Object.entries(obj).map(([key, value]) => {
    res += `\n${space}  `;
    if (typeof(value) === 'object' && !value._column) {
      res += `${key}: ${stringifyMock(value, spaceCount + 2)},`;
    } else if (value.type === 'number') {
      res += `'${key}|0-100.0-4': 1,`;
    } else if (value.type === 'date') {
      res += `${key}: '@date("yyyy-MM-dd HH:mm:ss")',`;
    } else if (value.type === 'enum') {
      res += `'${key}|1': [${value.options.map(o => `'${o.key}'`)}],`;
    } else {
      res += `${key}: '${key}-@string("lower", 5)',`;
    }
  });
  return `{${res}\n${space}}`;
}

function digestOpt(opt, spaceCount = 0) {
  let obj = opt.columns.reduce((p, n) => ({
    ...p,
    [n.dataIndex]: {
      ...n,
      _column: true,
    },
  }), {});

  obj = digest(obj);

  return stringifyMock(obj, spaceCount);
}