// api/feed.js
module.exports = (req, res) => {
  try {
    const type = req.query.type || 'recommend';
    const page = parseInt(req.query.page) || 1;
    const data = generateMockData(type, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};