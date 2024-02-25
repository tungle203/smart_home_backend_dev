const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const helmet = require('helmet');

const route = require('./routes');

const port = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    const apiKey = req.header('X-API-KEY');
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(403).send('Unauthorized');
    }
    next();
});

route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
