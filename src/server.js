const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const route = require('./routes/index.route');
const auth = require('./middlewares/auth');

const port = process.env.PORT || 4000;

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(auth);

route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
