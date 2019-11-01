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
  }
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
