const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./modules');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Render/Vercel terminate TLS upstream, so without this Express sees plain HTTP
// and req.ip is the proxy, not the visitor.
app.set('trust proxy', 1);

app.use(helmet());

// credentials:true — the refresh token and guest cart id travel as cookies across origins.
app.use(cors({ origin: env.clientOrigin, credentials: true }));

app.use(cookieParser());
app.use(morgan(env.isProd ? 'combined' : 'dev'));

app.get('/health', (req, res) => res.json({ status: 'ok', env: env.nodeEnv }));

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
