#!/usr/bin/env node

'use strict';

/* eslint-env es6 */

var shell = require('shelljs');

shell.rm('-rf', 'demo');
shell.mkdir('demo');

shell.cp('support/demo_template/index.html', 'demo/index.html');
shell.exec('node_modules/.bin/rollup -c support/demo_template/rollup.config.js');
