let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let flash = require('express-flash');
let session = require('express-session');
let fileUpload = require('express-fileupload');
//==login
const passport = require("passport")
const methodOverride = require('method-override')
//login==
//--------------route paths-----------
let indexRouter = require('./routes/index');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({
  cookie: { maxAge: 1200000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: true,
  secret: "secret"
}))
app.use(flash());
//======login=========
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//========routers============
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;