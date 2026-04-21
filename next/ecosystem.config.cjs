module.exports = {
  apps: [{
    name: 'hptuning',
    script: 'npx',
    args: 'next start -p 3000',
    cwd: '/home/user/hp-repo/next',
    env: { NODE_ENV: 'production', PORT: 3000 },
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
