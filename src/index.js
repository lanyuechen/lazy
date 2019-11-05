#!/usr/bin/env node

const program = require('commander');
const package = require('../package.json');

require('./cmd/add');
require('./cmd/remove');

program
  .version(package.version, '-v, --version')

program.parse(process.argv);