const expressJwt = require("express-jwt");
const jwt = require('jsonwebtoken');
const secret = "LOGIN_SUCCESS"
// set JWT
function setToken(userName, jwtSecret = secret, expiresIn = "15d") {
	return new Promise((resolve, reject) => {
		jwt.sign(
			{ userName: userName },
			jwtSecret,
			{ expiresIn: expiresIn },
			(err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			}
		);
	});
}

function dynamicJwtCheck(req, res, next) {
	console.log(req.path);
	const jwtMiddleware = expressJwt({
		secret: secret,
		algorithms: ["HS256"],
	}).unless({
		path: [
			"/adminapi/user/signin",
			"/adminapi/user/signup",
			{ url: /^\/adminapi\/user\/getanswer\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, methods: ['GET'] }
		],
	});

	jwtMiddleware(req, res, next);
}

module.exports = {
	setToken,
	dynamicJwtCheck
}