const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3000;

// 打印环境信息（调试用）
console.log('Environment:', process.env.NODE_ENV);
console.log('Working directory:', process.cwd());

// CORS 配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 验证public目录
const publicPath = path.join(process.cwd(), 'public');
console.log('Static files path:', publicPath);

fs.access(publicPath, fs.constants.F_OK, (err) => {
  if (err) {
    console.error('Public directory does not exist:', err);
  } else {
    console.log('Public directory exists');
  }
});

app.use(express.static(publicPath));

// 优化的模拟数据生成器 - 使用安全的图片URL
function generateMockData(type = 'recommend', page = 1) {
  const data = [];
  const itemsPerPage = 10;
  
  // 不同类型的数据
  const titles = { /* 保持不变 */ };
  const users = ["游戏达人", "小可爱", "王者归来", "吃鸡高手", "游戏小白", "大神玩家", "快乐玩家", "游戏迷", "幸运星", "游戏主播"];
  
  // 使用Picsum安全图片服务
  const images = [
    "https://picsum.photos/seed/game1/800/600",
    "https://picsum.photos/seed/game2/800/600",
    "https://picsum.photos/seed/game3/800/600",
    "https://picsum.photos/seed/game4/800/600",
    "https://picsum.photos/seed/game5/800/600",
    "https://picsum.photos/seed/game6/800/600",
    "https://picsum.photos/seed/game7/800/600",
  ];
  
  // 使用示例视频服务
  const videos = [
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  ];
  
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (page - 1) * itemsPerPage + i;
    const isVideo = Math.random() > 0.7;
    
    const imgIndex = Math.floor(Math.random() * images.length);
    const videoIndex = Math.floor(Math.random() * videos.length);
    
    data.push({
      id: index,
      title: titles[type][Math.floor(Math.random() * titles[type].length)],
      type: isVideo ? 'video' : 'image',
      media: isVideo ? videos[videoIndex] : images[imgIndex],
      poster: isVideo ? images[imgIndex] : null,
      user: users[Math.floor(Math.random() * users.length)],
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 500),
      timestamp: Date.now() - Math.floor(Math.random() * 10000000)
    });
  }
  
  return data;
}

// API路由 - 增强错误处理
app.get('/api/feed', (req, res) => {
  try {
    console.log('API request received:', req.query);
    
    const type = req.query.type || 'recommend';
    const page = parseInt(req.query.page) || 1;
    
    // 验证输入参数
    if (isNaN(page) || page < 1) {
      throw new Error('Invalid page number');
    }
    
    // 模拟API延迟
    setTimeout(() => {
      const data = generateMockData(type, page);
      console.log(`Returning ${data.length} items for type=${type}, page=${page}`);
      res.json(data);
    }, 500);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// 所有其他路由返回index.html（SPA应用）
app.get('*', (req, res) => {
  try {
    const indexPath = path.join(publicPath, 'index.html');
    res.sendFile(indexPath);
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    details: err.message || 'Unknown error' 
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});