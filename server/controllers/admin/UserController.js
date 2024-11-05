const user_service = require("../../services/admin/UserService");
const { setToken } = require("../../util/jwt")
const getAIAnswer = require('../../ai_model/ai')
const { v4: uuidv4 } = require('uuid');
const questionDB = {}
let current_ques_userID = ''
const user_controller = {
    login: (req, res) => {
        user_service.login(req.body, async (result) => {
            if (result == 0) {
                res.send({
                    code: "400",
                    error: "Incorrect username or password."
                })
            }
            else {
                // generate token
                const token = await setToken(result[0].user_name)
                res.send({
                    ActionType: "OK",
                    token
                })
            }
        });
    },
    signup: (req, res) => {
        user_service.signup(req.body, async (result) => {
            if (result === -1) {
                res.send({
                    code: "500",
                    error: "DB error..."
                })
            }
            else if (result === 1) {
                res.send({
                    ActionType: "REPEAT",
                })
            }
            else {
                res.send({
                    ActionType: "OK",
                })
            }
        });

    },
    sendQuestion: (req, res) => {
        current_ques_userID = req.user.userName;
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'No question provided' });
        }
        const questionId = uuidv4();
        questionDB[questionId] = question;

        res.json({ questionId });
    },
    getAnswer: (req, res) => {
        user_service.browseHabits(current_ques_userID, async (result) => {
            const { questionId } = req.params;
            const questionData = questionDB[questionId];
            if (!questionData) {
                return res.json({ error: 'Question not found' });
            };
            getAIAnswer(res, questionData, result);
            current_ques_userID = ''
        });
    },
    info: (req, res) => {
        user_service.getInfo(req.user.userName, async (result) => {
            res.send({
                code: result.length,
                userName: req.user.userName,
                body: result
            })
        });
    },
    browseHabits: (req, res) => {
        user_service.browseHabits(req.user.userName, async (result) => {
            res.send({
                code: result.length,
                body: result
            })
        });
    },
    saveHabit: (req, res) => {
        user_service.saveHabit(req.body, async (result) => {
            res.send({
                code: result
            })
        });
    },
    addHabit: (req, res) => {
        user_service.addHabit(req.user, req.body, async (result) => {
            res.send({
                code: result
            })
        });
    },
    updateHabitRecord: (req, res) => {
        user_service.updateHabitRecord(req.user.userName, req.body.habit_id, async (result) => {
            res.send({
                code: result
            })
        });
    },
    getOtherHabit: (req, res) => {
        user_service.getOtherHabit(req.user.userName, async (result) => {
            res.send({
                code: result.length,
                body: result
            })
        });
    },
    giveStar: (req, res) => {
        console.log(req.body.habit_id);
        user_service.giveStar(req.body.habit_id, req.body.star_num, async (result) => {
            res.send({
                code: result,
            })
        });
    },
    getRanking: (req, res) => {
        user_service.getRanking(req.user.userName, async (result, myResult, myRank) => {
            res.send({
                code: result.length,
                body: result,
                myName: req.user.userName,
                myScore: myResult,
                myRank: myRank
            })
        });
    },
}

module.exports = user_controller;