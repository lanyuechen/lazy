const program = require('commander');
const path = require('path');
const fs = require('fs');

const { tpl, writeFile, toUpperFirstCase, digestOpt } = require('../utils/common');

program
  .command('add <name>')
  .description('add a page')
  .option('-b, --batch', 'enable batch delete')
  .option('-s, --src <path>', 'src root', './src')
  .option('-o, --option <json|path>', 'table option', './option.json')
  .action(addHandler);

function addHandler(name, args) {
  const { src, option, batch } = args;

  const opt = getOption(option);

  const context = { name, opt, batch, digestOpt };
  const nameCapital = toUpperFirstCase(name);

  // 创建page
  writeFile(path.join(src, `pages/${nameCapital}/index.tsx`), tpl('pages/index.njk', context));
  // 创建ModalUpsert
  writeFile(path.join(src, `pages/${nameCapital}/ModalUpsert.tsx`), tpl('pages/modal-upsert.njk', context));
  // 创建model
  writeFile(path.join(src, `pages/${nameCapital}/model.ts`), tpl('model.njk', context));
  // 创建service
  writeFile(path.join(src, `pages/${nameCapital}/service.ts`), tpl('service.njk', context));
  // 创建mock
  writeFile(path.join(src, `pages/${nameCapital}/_mock.ts`), tpl('mock.njk', context));
  // 创建utils/lazy-ant/sorter
  writeFile(path.join(src, `utils/lazy-ant/sorter.ts`), tpl('utils/sorter.njk', context));
  // 创建utils/lazy-ant/filter
  writeFile(path.join(src, `utils/lazy-ant/filter.tsx`), tpl('utils/filter.njk', context));

  console.log(
    'src\n' +
    ' ├─ pages\n' +
    ` │   └─ ${nameCapital}\n` +
    ' │       ├─ index.tsx\n' +
    ' │       ├─ ModalUpsert.tsx\n' +
    ' │       ├─ model.ts\n' +
    ' │       ├─ service.ts\n' +
    ' │       └─ _mock.ts\n' +
    ' └─ utils\n' +
    '     └─ lazy-ant\n' +
    '         ├─ filter.tsx\n' +
    '         └─ sorter.ts'
  );
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