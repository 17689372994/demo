// server.js
const express = require('express');
const app = express();
const path = require('path');

// 中间件设置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.get('/api/feed', (req, res, next) => {
    try {
        // 这里可以包含你的API逻辑
        // 为了简化，我们可以直接使用前面的generateMockData函数
        const type = req.query.type || 'recommend';
        const page = parseInt(req.query.page) || 1;
        
        // 模拟API延迟
        setTimeout(() => {
            const data = generateMockData(type, page);
            res.json(data);
        }, 500);
    } catch (error) {
        // 将错误传递给错误处理中间件
        next(error);
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  
  // 确保响应尚未发送
  if (!res.headersSent) {
    res.status(500).json({
      error: 'Internal Server Error',
      details: err.message || 'Unknown error'
    });
  }
});

// 导出Express应用供Vercel使用
module.exports = app;