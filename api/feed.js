// Vercel API 处理函数
export default function handler(req, res) {
    console.log('API请求收到:', req.method, req.url, req.query);
    
    try {
      console.log('2. 收到请求:', req.method, req.url);
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
        console.log('3. 生成数据数量:', data.length);
        // 返回数据
        res.status(200).json(data);
    } catch (error) {
        console.log('4. 捕获到错误:', error.message);
        res.status(500).json({
            error: '服务器内部错误',
            details: error.message || '未知错误',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}