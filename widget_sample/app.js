var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// method-override
var methodOverride = require('method-override');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('X-HTTP-Method-Override'));

app.use('/', index);
app.use('/users', users);


// START ex.7-4
var widgets = [
  {
    id : 1,
    name : 'My Special Widget',
    price : 100.00,
    descr : 'A widget beyond price'
  }
]

app.get('/widgets/:id', (req, res) => {
  var indx = parseInt(req.params.id) - 1;
  if (!widgets[indx])
    res.send('There is no widget with id of ' + req.params.id);
  else
    res.send(widgets[indx]);
});

app.post('/widgets/add', (req, res) => {
  var indx = widgets.length + 1;
  widgets[indx-1] = {
    id : indx,
    name : req.body.widgetname,
    price : parseFloat(req.body.widgetprice),
    descr : req.body.widgetdesc
  }
  console.log('added' + widgets[indx-1]);
  res.send('Widget ' + req.body.widgetname + ' added with id ' + indx);
});

app.delete('/widgets/:id/delete', (req, res) => {
  var indx = req.params.id - 1;
  delete widgets[indx];
  console.log('deldted ' + indx+1);
  res.send('deldted ' + indx+1);
});

app.put('/widgets/:id/update', (req, res) => {
  var indx = req.params.id - 1;
  widgets[indx] = {
    di: indx,
    name : req.body.widgetname,
    price : parseFloat(req.body,widgetprice),
    descr : req.body.widgetdesc
  };
  console.log(widgets[indx]);
  res.send('Updated ' + req.params.id);
})
// END ex.7-4

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
