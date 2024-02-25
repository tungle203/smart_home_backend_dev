// create user model
const db = require('../config/db');

const createUserTable = () => {
    const sql =
        'DROP TABLE IF EXISTS users;\
    CREATE TABLE users (\
        id INTEGER PRIMARY KEY,\
        name TEXT, email TEXT,\
        password TEXT \
    )';

    db.exec(sql, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports = createUserTable;
