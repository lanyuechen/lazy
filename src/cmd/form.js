const program = require('commander');

const { tpl } = require('../utils/common');
const { prepareColumns } = require('./utils');

program
  .command('form')
  .description('generate a form')
  .option('-c, --columns <string|json|path>', 'columns config', 'name, date|date')
  .action(formHandler);

function formHandler(args) {
  const { columns } = args;

  const context = {
    columns: prepareColumns(columns),
  };

  console.log(tpl('antd/form.njk', context))
}
