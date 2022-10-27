module.exports = {
  apps: [{
  name: 'orderME',
  script: './index.js',
  instances: 0,
  exec_mode: 'cluster',
  watch: true
  }]
}