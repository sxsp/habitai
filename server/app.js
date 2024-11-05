var createError = require('http-errors');
var express = require('express');
const compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let { dynamicJwtCheck } = require('./util/jwt');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const user_router = require('./routes/admin/UserRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.all("*", function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	if (req.method.toLowerCase() == "options") return res.sendStatus(200);
	else next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(dynamicJwtCheck);
app.use(function (err, req, res, next) {
	console.log(err);
	if (err.status == 401) {
		return res.json({
			code: 401,
			message: "UnAuthorized",
		});
	}
	next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
// my add -----------------------------------------------------------------------------------------------
app.use(user_router)
const user_service = require('./services/admin/UserService');



// my add -----------------------------------------------------------------------------------------------

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


