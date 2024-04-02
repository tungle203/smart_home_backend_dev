const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../models/index.model');
const User = db.user;
const Room = db.room;
const AdafruitService = require('../services/adafruit.service');

class UserController {
    static async generateToken(payload) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            // expiresIn: '1h',
        });
    }

    async register(req, res) {
        const { userName, password } = req.body;
        if (!userName || !password) {
            return res.status(400).send('Invalid input');
        }

        try {
            const userFound = await User.findOne({
                where: {
                    userName: userName,
                },
            });
            if (userFound) {
                return res.status(400).json({ error: 'User already exists' });
            }
            await AdafruitService.createGroup(userName);
            const user = await User.create({
                userName: userName,
                password: password,
            });
            await Room.create({
                name: 'Entire house',
                UserId: user.id,
            });
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
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
        const accessToken = await UserController.generateToken({
            userId: user.id,
            userName: user.userName,
        });
        res.status(200).send({ accessToken });
    }
}

module.exports = new UserController();
