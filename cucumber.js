'use strict';

module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register', 'tsconfig-paths/register'],
    require: ['features/step-definitions/**/*.ts'],
  },
};
