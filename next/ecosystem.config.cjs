module.exports = {
  apps: [
    {
      name: 'hptuning',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: '/home/user/hp-project/next',
      env: { NODE_ENV: 'production', PORT: 3000 },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
