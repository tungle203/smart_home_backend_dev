const db = require('../config/db');

class userController {
    showUser(req, res) {
        const sql = 'select * from users';

        db.all(sql, (err, results) => {
            if (err) {
                return res.sendStatus(500);
            }
            res.json(results);
        });
    }

    addUser(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.sendStatus(400);

        const sql = 'INSERT INTO users(name, email, password) VALUES (?,?,?)';
        const values = [name, email, password];

        db.run(sql, values, (err) => {
            if (err) {
                return res.sendStatus(500);
            }
            res.sendStatus(201);
        });
    }
}

module.exports = new userController();
