const program = require('commander');
const path = require('path');
const fs = require('fs');

const { tpl, writeFile, toUpperFirstCase, digestColumns } = require('../utils/common');

program
  .command('add <name>')
  .description('add a page')
  .option('-b, --batch', 'enable batch delete')
  .option('-s, --src <path>', 'src root', './src')
  .option('-c, --columns <string|json|path>', 'columns config', 'name, date|date')
  .action(addHandler);

function addHandler(name, args) {
  const { src, batch } = args;

  const columns = getColumns(args.columns);

  const context = { name, columns, batch, digestColumns };
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

function getColumns(columns) {
  if (isJsonString(columns)) {
    columns = JSON.parse(columns);
  } else {
    try {
      columns = fs.readFileSync(columns, 'utf8');
      columns = JSON.parse(columns);
    } catch(err) {
      columns = columns.split(',').map(c => c.trim());
    }
  }
  return columns.map(column => {
    if (typeof (column) === 'string') {
      const [ dataIndex, type, title ] = column.split('|').map(c => c.trim());
      return {
        dataIndex,
        type,
        title: title || toUpperFirstCase(dataIndex),
      }
    }
    return {
      ...column,
      title: column.title || toUpperFirstCase(column.dataIndex),
    };
  });
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