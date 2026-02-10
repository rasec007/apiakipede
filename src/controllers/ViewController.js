const prisma = require('../lib/prisma');

class ViewController {
    async getTiposEmUso(req, res) {
        try {
            const data = await prisma.$queryRaw`SELECT * FROM vw_tipos_em_uso`;
            return res.json(data);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch view data' });
        }
    }
}

module.exports = new ViewController();
