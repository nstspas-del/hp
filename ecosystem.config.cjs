module.exports = {
  apps: [{
    name: 'hp-tuning',
    script: 'npx',
    args: 'serve site -p 3000',
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
