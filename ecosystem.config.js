/**
 * PM2 配置文件
 * 
 * 使用方法：
 * pm2 start ecosystem.config.js
 * pm2 restart ecosystem.config.js
 * pm2 stop ecosystem.config.js
 * pm2 delete ecosystem.config.js
 */

module.exports = {
  apps: [
    {
      name: 'calculator',                    // 应用名称
      script: 'npm',                         // 使用 npm
      args: 'start',                         // 运行 npm start
      cwd: './',                             // 工作目录
      instances: 1,                          // 实例数量
      exec_mode: 'cluster',                  // 执行模式（cluster 或 fork）
      watch: false,                          // 是否监听文件变化
      max_memory_restart: '500M',            // 内存限制自动重启
      env: {
        NODE_ENV: 'production',
        PORT: 18333,                         // 端口号
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      error_file: './logs/err.log',          // 错误日志
      out_file: './logs/out.log',            // 输出日志
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,                     // 自动重启
      min_uptime: '10s',                     // 最小运行时间
      max_restarts: 10,                      // 最大重启次数
      restart_delay: 4000,                   // 重启延迟（毫秒）
    },
  ],
}

