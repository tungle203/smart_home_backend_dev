const bcrypt = require('bcrypt');
const db = require('../models/index.model');
const User = db.user;

class UserController {
    async getUserInfo(req, res) {
        try {
            const user = await User.findByPk(req.userId, {
                attributes: { exclude: ['password'] },
            });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            return res.status(200).json(user);
        }
        catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async updateUser(req, res) {
        const {password, email, fullName, phoneNumber} = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        try {
            const user = await User.findOne({
                where: {
                    id: req.userId,
                },
            });
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            user.email = email ?? user.email;
            user.fullName = fullName ?? user.fullName;
            user.phoneNumber = phoneNumber ?? user.phoneNumber;
            await user.save();
            return res.sendStatus(200);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = new UserController();