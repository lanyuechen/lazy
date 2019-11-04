const program = require('commander');
const path = require('path');
const fs = require('fs');

const { tpl, writeFile, toUpperFirstCase } = require('../utils/common');

program
  .command('add <name>')
  .description('add a page')
  .option('-s, --src <path>', 'src路径', './src')
  .option('-o, --option <json|path>', '表结构配置json或配置文件路径', './option.json')
  .action(addHandler);

function addHandler(name, args) {
  const { src, option } = args;

  const opt = getOption(option);

  const context = { name, opt };
  const nameCapital = toUpperFirstCase(name);

  // 创建model
  writeFile(path.join(src, `models/${name}.ts`), tpl('model.njk', context));
  // 创建service
  writeFile(path.join(src, `services/${name}.ts`), tpl('service.njk', context));
  // 创建page
  writeFile(path.join(src, `pages/${nameCapital}/index.tsx`), tpl('pages/index.njk', context));
  // 创建ModalUpsert
  writeFile(path.join(src, `pages/${nameCapital}/ModalUpsert.tsx`), tpl('pages/modal-upsert.njk', context));
  // 创建mock
  writeFile(path.join(src, `../mock/${name}.ts`), tpl('mock.njk', context));
  // 创建utils/table/sorter
  writeFile(path.join(src, `utils/table/sorter.ts`), tpl('utils/sorter.njk', context));
  // 创建utils/table/filter
  writeFile(path.join(src, `utils/table/filter.tsx`), tpl('utils/filter.njk', context));
}

function getOption(option) {
  let opt;
  if (isJsonString(option)) {
    opt = JSON.parse(option);
  } else {
    try {
      opt = fs.readFileSync(option, 'utf8');
      opt = JSON.parse(opt);
    } catch(err) {
      opt = { id: 'id', columns: [] };
    }
  }
  opt = {
    ...opt,
    columns: opt.columns.map(column => {
      if (typeof (column) === 'string') {
        return {
          title: toUpperFirstCase(column),
          dataIndex: column,
        }
      }
      return {
        ...column,
        title: column.title || toUpperFirstCase(column.dataIndex),
      };
    }),
  };
  return opt;
}

function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {
  }
  return false;
}