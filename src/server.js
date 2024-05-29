const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('./config/session');
const route = require('./routes/index.route');
const limiter = require('./config/limiter');
const port = process.env.PORT || 4000;

app.set('trust proxy', 1);
app.use(limiter);
app.use(cookieParser());
morgan.token('origin', (req) => {
    return req.get('origin') || req.get('host'); // Sử dụng 'origin' nếu có, nếu không sử dụng 'host'
  });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :origin'));
app.use(session);

app.use(cors(
  {
    origin: '*'
  }
));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});

