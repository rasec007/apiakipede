const prisma = require('../lib/prisma');

class GenericController {
    constructor(modelName, idField) {
        this.modelName = modelName;
        this.idField = idField;
    }

    index = async (req, res) => {
        try {
            const items = await prisma[this.modelName].findMany();
            return res.json(items);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: `Failed to list ${this.modelName}` });
        }
    };

    show = async (req, res) => {
        const { id } = req.params;
        try {
            const item = await prisma[this.modelName].findUnique({
                where: { [this.idField]: id },
            });

            if (!item) {
                return res.status(404).json({ error: `${this.modelName} not found` });
            }

            return res.json(item);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: `Failed to get ${this.modelName}` });
        }
    };

    store = async (req, res) => {
        try {
            const item = await prisma[this.modelName].create({
                data: req.body,
            });
            return res.status(201).json(item);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: `Failed to create ${this.modelName}` });
        }
    };

    update = async (req, res) => {
        const { id } = req.params;
        try {
            const item = await prisma[this.modelName].update({
                where: { [this.idField]: id },
                data: req.body,
            });
            return res.json(item);
        } catch (err) {
            console.error(err);
            return res.status(400).json({ error: `Failed to update ${this.modelName}` });
        }
    };

    destroy = async (req, res) => {
        const { id } = req.params;
        try {
            await prisma[this.modelName].delete({
                where: { [this.idField]: id },
            });
            return res.status(204).send();
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: `Failed to delete ${this.modelName}` });
        }
    };
}

module.exports = GenericController;
