const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../models/index.model');
const User = db.user;

class UserController {
    static async generateToken(payload) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1h',
        });
    }

    async register(req, res) {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).send('Invalid input');
        }

        try {
            const user = await User.create({
                userName: userName,
                password: password,
            });
            res.status(201).send(user);
        } catch (error) {
            res.sendStatus(400);
        }
    }

    async login(req, res) {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).send('Invalid input');
        }
        const user = await User.findOne({
            where: {
                userName: userName,
                password: password,
            },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }
        const accessToken = await UserController.generateToken({ userId: user.id, userName: user.userName});
        res.status(200).send({ accessToken });
    }
}

module.exports = new UserController();