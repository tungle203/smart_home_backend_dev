const uuidv4 = require('uuid').v4;
const bcrypt = require('bcrypt');
const db = require('../models/index.model');
const User = db.user;
const AdafruitService = require('../services/adafruit.service');
const e = require('express');

class AuthController {
    async register(req, res) {
        const { userName, password, email, phoneNumber, fullName } = req.body;
        if (!userName || !password || !email) {
            return res.status(400).json({ error: 'Invalid input' });
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

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                userName: userName,
                password: hashedPassword,
                email: email,
                phoneNumber: phoneNumber ?? null,
                fullName: fullName ?? null,
            });
            res.status(201).json({
                userId: user.id,
                userName: user.userName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                fullName: user.fullName,
            });
        } catch (error) {
            console.log(error);
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
                deleted: false,
                userName: userName,
            },
        });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }

        const sessionID = uuidv4();

        req.session[sessionID] = {
            userId: user.id,
            userName: user.userName,
        };
        res.setHeader(
            'Set-Cookie',
            `sessionID=${sessionID}; HttpOnly; Max-Age=${1000 * 60 * 60 * 24}`,
            'domain=localhost',
        );
        res.status(200).json({
            userId: user.id,
            userName: user.userName,
        });
    }

    async logout(req, res) {
        const sessionId = req.cookies.sessionID;
        if (!sessionId) {
            return res.status(401).send('Access Denied');
        }
        delete req.session[sessionId];
        res.setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0');
        res.status(200).send('Logged out');
    }
}

module.exports = new AuthController();
