const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (params = {}) => {
    return jwt.sign(params, process.env.JWT_SECRET, {
        expiresIn: 86400, // 24 hours
    });
};

class AuthController {
    async signup(req, res) {
        const { email, senha, nome, id_usuario } = req.body;

        try {
            if (await prisma.usuario.findUnique({ where: { email } })) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const passwordHash = await bcrypt.hash(senha, 8);

            const user = await prisma.usuario.create({
                data: {
                    id_usuario: id_usuario || crypto.randomUUID(),
                    email,
                    senha: passwordHash,
                    nome,
                },
            });

            user.senha = undefined;

            return res.status(201).json({
                user,
                token: generateToken({ id: user.id_usuario }),
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Registration failed' });
        }
    }

    async login(req, res) {
        const { email, senha } = req.body;

        try {
            const user = await prisma.usuario.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            if (!(await bcrypt.compare(senha, user.senha))) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            user.senha = undefined;

            return res.json({
                user,
                token: generateToken({ id: user.id_usuario }),
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Login failed' });
        }
    }
}

module.exports = new AuthController();
