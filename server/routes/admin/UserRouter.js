var express = require('express');
const user_controller = require('../../controllers/admin/UserController');
var user_router = express.Router();


user_router.post('/adminapi/user/signin', user_controller.login);
user_router.post('/adminapi/user/signup', user_controller.signup);
user_router.post('/adminapi/user/sendquestion', user_controller.sendQuestion);
user_router.post('/adminapi/user/savehabit', user_controller.saveHabit);
user_router.post('/adminapi/user/addhabit', user_controller.addHabit);
user_router.post('/adminapi/user/updatetodayhabit', user_controller.updateHabitRecord);
user_router.post('/adminapi/user/givestar', user_controller.giveStar);
user_router.get('/adminapi/user/getanswer/:questionId', user_controller.getAnswer);
user_router.get('/adminapi/user/info', user_controller.info);
user_router.get('/adminapi/user/browsehabits', user_controller.browseHabits);
user_router.get('/adminapi/user/getothers', user_controller.getOtherHabit);
user_router.get('/adminapi/user/getranking', user_controller.getRanking);
module.exports = user_router;
