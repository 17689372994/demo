// server.js
const express = require('express');
const app = express();
const path = require('path');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 模拟数据生成器（保持原有逻辑不变）
function generateMockData(type = 'recommend', page = 1) {
    // 保持原有函数内容不变...
}

// API路由
app.get('/api/feed', (req, res) => {
    const type = req.query.type || 'recommend';
    const page = parseInt(req.query.page) || 1;
    
    // 模拟API延迟
    setTimeout(() => {
        const data = generateMockData(type, page);
        res.json(data);
    }, 500);
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    details: err.message || 'Unknown error' 
  });
});

// 导出Express应用供Vercel使用
module.exports = app;