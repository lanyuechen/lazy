#!/usr/bin/env node

const program = require('commander');

require('./cmd/add');
require('./cmd/remove');

program
  .version('0.0.1', '-v, --version')

program.parse(process.argv);