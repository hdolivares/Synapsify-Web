// PM2 Ecosystem Configuration
// Run: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'synapsify-web',
      script: 'npm',
      args: 'start',
      cwd: '/home/synapsify.app/synapsify-web',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      watch: false,
    },
  ],
}

