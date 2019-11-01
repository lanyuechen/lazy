#!/usr/bin/env node

const program = require('commander');

require('./cmd/add');

program
    .version('0.0.1', '-v, --version')
    .option('-t, --test <path>', 'test something') // 尖括号表示必填参数

/**
 * wtf
 * command()指定第二个参数会造成一系列不可预期的错误？？？
 */
program
  .command('setup')
  .description('run remote setup commands')
  .action(function () {
    console.log('setup');
  });

program.parse(process.argv);