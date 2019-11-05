const program = require('commander');
const path = require('path');

const { rmDirsSync, toUpperFirstCase } = require('../utils/common');

program
  .command('remove <name>')
  .description('remove a page')
  .option('-s, --src <path>', 'src root', './src')
  .action(removeHandler);

function removeHandler (name, args) {
  const { src } = args;
  const nameCapital = toUpperFirstCase(name);

  // 移除page
  rmDirsSync(path.join(src, `pages/${nameCapital}`));
  // 移除utils/lazy-ant
  rmDirsSync(path.join(src, 'utils/lazy-ant'));
}