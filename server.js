const express = require('express');
const app = express();
const path = require('path');
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

// 静态文件服务 - 使用 process.cwd() 确保路径正确
const publicPath = path.join(process.cwd(), 'public');
console.log('Static files path:', publicPath);
app.use(express.static(publicPath));
// 模拟数据生成器
function generateMockData(type = 'recommend', page = 1) {
    const data = [];
    const itemsPerPage = 10;
    
    // 不同类型的数据
    const titles = {
        recommend: [
            "这款游戏太好玩了，强烈推荐给大家！",
            "新版本更新内容抢先看",
            "游戏攻略：如何快速升级",
            "组队开黑，有一起的吗？",
            "这个BOSS怎么打？求攻略",
            "游戏里的隐藏彩蛋你发现了吗？",
            "分享我的游戏截图，风景太美了",
            "新手入门指南，快速上手",
            "游戏中的感人剧情，泪目了",
            "最新活动福利汇总"
        ],
        hot: [
            "热门游戏排行Top10",
            "大家都在玩的爆款游戏",
            "最新热门活动开启",
            "热门游戏礼包领取",
            "热游新版本体验报告",
            "热门游戏组队招募",
            "热游攻略大全",
            "热游玩家心得分享",
            "热游更新内容解析",
            "热游玩家社区活动"
        ],
        new: [
            "新游戏上线！快来体验",
            "最新版本更新公告",
            "新活动：登录送好礼",
            "新角色上线，技能解析",
            "新地图探索攻略",
            "新版本体验分享",
            "新功能使用指南",
            "新玩家入门教程",
            "新赛季开启公告",
            "新皮肤上架，限时折扣"
        ]
    };
    
    const users = ["游戏达人", "小可爱", "王者归来", "吃鸡高手", "游戏小白", "大神玩家", "快乐玩家", "游戏迷", "幸运星", "游戏主播"];
    
    // 图片和视频资源
    const images = [
        "http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960",
        "http://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024",
        "http://gips3.baidu.com/it/u=1821127123,1149655687&fm=3028&app=3028&f=JPEG&fmt=auto?w=720&h=1280",
        "http://gips3.baidu.com/it/u=3886271102,3123389489&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960",
        "http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280",
        "http://gips0.baidu.com/it/u=3602773692,1512483864&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280",
        "http://gips3.baidu.com/it/u=1022347589,1106887837&fm=3028&app=3028&f=JPEG&fmt=auto?w=960&h=1280",
    ];
    
    const videos = [
        "https://www.runoob.com/try/demo_source/movie.mp4",
        "https://www.runoob.com/try/demo_source/movie.mp4",
        "https://www.runoob.com/try/demo_source/movie.mp4",
        "https://www.runoob.com/try/demo_source/movie.mp4",
        "https://www.runoob.com/try/demo_source/movie.mp4",
    ];
    
    for (let i = 0; i < itemsPerPage; i++) {
        const index = (page - 1) * itemsPerPage + i;
        const isVideo = Math.random() > 0.7;
        
        // 从数组中随机选择资源
        const imgIndex = Math.floor(Math.random() * images.length);
        const videoIndex = Math.floor(Math.random() * videos.length);
        
        data.push({
            id: index,
            title: titles[type][Math.floor(Math.random() * titles[type].length)],
            type: isVideo ? 'video' : 'image',
            media: isVideo ? videos[videoIndex] : `${images[imgIndex]}?auto=format&fit=crop&w=400&h=300&q=80`,
            poster: isVideo ? `${images[imgIndex]}?auto=format&fit=crop&w=400&h=300&q=80` : null,
            user: users[Math.floor(Math.random() * users.length)],
            likes: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 500),
            timestamp: Date.now() - Math.floor(Math.random() * 10000000)
        });
    }
    
    return data;
}
// API路由 - 添加错误处理
app.get('/api/feed', (req, res) => {
  try {
    const type = req.query.type || 'recommend';
    const page = parseInt(req.query.page) || 1;
    
    // 模拟API延迟
    setTimeout(() => {
      const data = generateMockData(type, page);
      res.json(data);
    }, 500);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// 所有其他路由返回index.html（SPA应用）
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// 添加全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});