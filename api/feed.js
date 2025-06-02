// api/feed.js
import { VercelRequest, VercelResponse } from '@vercel/node';

// 模拟数据生成器
function generateMockData(type = 'recommend', page = 1) {
    // 验证type参数
    const validTypes = ['recommend', 'hot', 'new'];
    if (!validTypes.includes(type)) {
        throw new Error(`Invalid type: ${type}. Allowed: ${validTypes.join(', ')}`);
    }
    
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
    
    // 使用可靠的图片服务
    const images = [
        "https://picsum.photos/400/300?random=1",
        "https://picsum.photos/400/300?random=2",
        "https://picsum.photos/400/300?random=3",
        "https://picsum.photos/400/300?random=4",
        "https://picsum.photos/400/300?random=5",
        "https://picsum.photos/400/300?random=6",
        "https://picsum.photos/400/300?random=7",
    ];
    
    const videos = [
        "https://www.runoob.com/try/demo_source/movie.mp4",
    ];
    
    for (let i = 0; i < itemsPerPage; i++) {
        const index = (page - 1) * itemsPerPage + i;
        const isVideo = Math.random() > 0.7;
        
        data.push({
            id: index,
            title: titles[type][i % titles[type].length], // 确保索引不越界
            type: isVideo ? 'video' : 'image',
            media: isVideo ? videos[0] : images[Math.floor(Math.random() * images.length)],
            poster: isVideo ? images[Math.floor(Math.random() * images.length)] : null,
            user: users[Math.floor(Math.random() * users.length)],
            likes: Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 500),
            timestamp: Date.now() - Math.floor(Math.random() * 10000000)
        });
    }
    
    return data;
}

// Vercel API 处理函数
export default function handler(req: VercelRequest, res: VercelResponse) {
    console.log('API请求收到:', req.method, req.url, req.query);
    
    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: '不支持的请求方法' });
        }
        
        const type = req.query.type?.toString() || 'recommend';
        const page = parseInt(req.query.page?.toString() || '1', 10);
        
        // 验证参数
        if (!['recommend', 'hot', 'new'].includes(type)) {
            return res.status(400).json({ error: '无效的type参数，允许值: recommend, hot, new' });
        }
        
        if (isNaN(page) || page < 1) {
            return res.status(400).json({ error: '无效的page参数，必须是大于0的整数' });
        }
        
        // 生成数据
        const data = generateMockData(type, page);
        
        // 返回数据
        res.status(200).json(data);
    } catch (error) {
        console.error('API处理错误:', error);
        res.status(500).json({
            error: '服务器内部错误',
            details: error.message || '未知错误',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}