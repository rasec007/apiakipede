const prisma = require('../lib/prisma');

class DominioController {
    async index(req, res) {
        try {
            const dominios = await prisma.dominio.findMany();
            return res.json(dominios);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to list dominios' });
        }
    }

    async show(req, res) {
        const { id } = req.params;
        try {
            const dominio = await prisma.dominio.findUnique({
                where: { id_dominio: id },
            });

            if (!dominio) {
                return res.status(404).json({ error: 'Dominio not found' });
            }

            return res.json(dominio);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to get dominio' });
        }
    }

    async store(req, res) {
        try {
            const dominio = await prisma.dominio.create({
                data: req.body,
            });
            return res.status(201).json(dominio);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to create dominio' });
        }
    }

    async update(req, res) {
        const { id } = req.params;
        try {
            const dominio = await prisma.dominio.update({
                where: { id_dominio: id },
                data: req.body,
            });
            return res.json(dominio);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: 'Failed to update dominio' });
        }
    }

    async destroy(req, res) {
        const { id } = req.params;
        try {
            await prisma.dominio.delete({
                where: { id_dominio: id },
            });
            return res.send();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete dominio' });
        }
    }
}

module.exports = new DominioController();
