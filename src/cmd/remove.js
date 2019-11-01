const program = require('commander');
const path = require('path');

const { rmDirsSync, toUpperFirstCase } = require('../utils/common');

program
  .command('remove <name>')
  .description('remove a page')
  .option('-s, --src [path]', 'src路径', './')
  .action(removeHandler);

function removeHandler (name, args) {
  const { src } = args;
  const nameCapital = toUpperFirstCase(name);

  // 移除model
  rmDirsSync(path.join(src, `models/${name}.ts`));
  // 移除service
  rmDirsSync(path.join(src, `services/${name}.ts`));
  // 移除page
  rmDirsSync(path.join(src, `pages/${nameCapital}`));
  // 移除mock
  rmDirsSync(path.join(src, `../mock/${name}.ts`));
  // 移除utils/table
  rmDirsSync(path.join(src, 'utils/table'));
}