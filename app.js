const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const factoryRoutes = require('./routes/factories');
const brandRoutes = require('./routes/brands');
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

app.use('/factories', factoryRoutes);

app.use('/brands', brandRoutes);

// going to http://localhost:3000/ in your browser should yield 'OK'
app.get('/', (req, res) => {
    res.sendStatus(200);
    res.send(index.html)
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

// error handlers in express must accept 4 parameters, so don't remove next (4th param)
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500);
    res.send({
        message: err.message,
        error: err
    });
});

// start the web server
const server = app.listen(3000, () => {
    const port = server.address().port;
    console.log('Server listening at port %s', port);
});

module.exports = server;
