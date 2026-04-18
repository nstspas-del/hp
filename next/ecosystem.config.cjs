module.exports = {
  apps: [
    {
      name: 'hptuning',
      script: 'npm',
      args: 'start',
      cwd: '/home/user/hp-repo/next',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
