module.exports = {
  extensions: ['ts'],
  require: ['ts-node/register'],
  timeout: '10m',
  files: ['src/**/*.spec.ts','!src/**/*.integration.spec.ts'],
};