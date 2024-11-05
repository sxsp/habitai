const { sign } = require('jsonwebtoken');

const getConn = () => {
    const mysql = require('mysql');

    const conn = mysql.createConnection({
        user: 'root',
        password: '123456',
        host: 'localhost',
        database: 'habitai'
    })
    conn.connect(err => {
        console.log(err, 'success if null');
        return -1;
    })
    return conn;
}

const user_service = {
    login: async ({ username, password }, callback) => {

        const conn = getConn();
        var userGetSql = 'SELECT * FROM UserInfo WHERE user_name = ? AND user_password = ?';

        conn.query(userGetSql, [username, password], function (err, result) {

            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                conn.end();
                return callback(0);
            }
            conn.end();
            return callback(result);
        });
    },
    signup: async ({ signup_username, signup_password_1, signup_password_2 }, callback) => {

        const conn = getConn();
        var userGetSql = 'SELECT * FROM UserInfo WHERE user_name = ?';
        var today = new Date();
        var todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        conn.query(userGetSql, [signup_username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                conn.end();
                return callback(-1);
            }
            if (result.length === 0) {
                const userInsertSql = 'INSERT INTO UserInfo (user_name, user_password, register_date, score) VALUES (?, ?, ?, 0)';
                conn.query(userInsertSql, [signup_username, signup_password_1, todayString], function (err, insertResult) {
                    if (err) {
                        console.log('[INSERT ERROR] - ', err.message);
                        conn.end();
                        return callback(-1);
                    }
                    console.log('NEW USER ADDED TO DATABASE');
                    conn.end()
                    return callback(0);
                });
            }
            else {
                console.log('FIND IN DB');
                conn.end()
                return callback(1);
            }
        });
        // -1: db error 0: success 1： wrong
    },
    getInfo: async (username, callback) => {

        const conn = getConn();
        var userGetSql = 'SELECT register_date, score FROM UserInfo WHERE user_name = ?';

        conn.query(userGetSql, [username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                conn.end();
                return callback(-1);
            }
            conn.end();

            return callback(result[0]);
        });
    },
    browseHabits: async (username, callback) => {

        const conn = getConn();
        var userGetSql = 'SELECT * FROM UserHabits WHERE user_name = ?';


        conn.query(userGetSql, [username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                conn.end();
                return callback(-1);
            }
            conn.end();
            return callback(result);
        });
    },
    saveHabit: async (editedHabits, callback) => {
        console.log(editedHabits);
        const conn = getConn();
        for (let i = 0; i < editedHabits.length; i++) {
            if (editedHabits[i].is_deleted) {
                var deleteQuery = 'DELETE FROM UserHabits WHERE habit_id = ?';
                conn.query(deleteQuery, [editedHabits[i].habit_id], function (err) {
                    if (err) {
                        console.log('[DELETE ERROR] - ', err.message);
                        conn.end();
                        return callback(-1);
                    }
                });
                continue;
            }
            var editQuery = 'UPDATE UserHabits SET habit_week = ?, habit_begin_date = ?, habit_end_date = ?, habit_start_time = ?, habit_dur_time = ?, is_open = ? WHERE habit_id = ?';
            conn.query(editQuery, [editedHabits[i].habit_week, editedHabits[i].habit_begin_date, editedHabits[i].habit_end_date, editedHabits[i].habit_start_time, editedHabits[i].habit_dur_time, editedHabits[i].is_open, editedHabits[i].habit_id], function (err) {
                if (err) {
                    console.log('[UPDATE ERROR] - ', err.message);
                    conn.end();
                    return callback(-1);
                }
            });
        }
        conn.end();
        return callback(0);
    },
    addHabit: async (userName, addedHabitName, callback) => {
        const conn = getConn();
        var today = new Date();
        var beginDay = new Date();
        var endDay = new Date();
        beginDay.setDate(today.getDate() + 1);
        endDay.setDate(beginDay.getDate() + 21);
        var todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        var beginDayString = `${beginDay.getFullYear()}-${(beginDay.getMonth() + 1).toString().padStart(2, '0')}-${beginDay.getDate().toString().padStart(2, '0')}`;
        var endDayString = `${endDay.getFullYear()}-${(endDay.getMonth() + 1).toString().padStart(2, '0')}-${endDay.getDate().toString().padStart(2, '0')}`;
        var addQuery = 'INSERT INTO UserHabits (user_name, user_habit, habit_week, habit_begin_date, habit_end_date, habit_start_time, habit_dur_time, habit_keep_record, habit_last_update, is_complete, is_open, star_num) VALUES (?, ?, 127, ?, ?, ?, 60, 0, ?, FALSE, FALSE, 0)';
        conn.query(addQuery, [userName.userName, addedHabitName.habitName, beginDayString, endDayString, '09:00', todayString], function (err) {
            if (err) {
                console.log('[ADD ERROR] - ', err.message);
                conn.end();
                return callback(-1);
            }
        });

        var selectQuery = 'SELECT habit_id FROM UserHabits WHERE user_name = ? AND user_habit = ?';
        conn.query(selectQuery, [userName.userName, addedHabitName.habitName], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                conn.end();
                return callback(-1);
            }
            conn.end();
            return callback(result[0].habit_id);
        });

    },
    updateHabitRecord: async (user_name, habit_id, callback) => {
        const conn = getConn();

        (async () => {
            try {
                var today = new Date();
                var todayString = `${today.getFullYear()}-${String((today.getMonth() + 1)).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                var selectQuery = 'SELECT habit_last_update, habit_keep_record FROM UserHabits WHERE habit_id = ?';
                let result = await new Promise((resolve, reject) => {
                    conn.query(selectQuery, [habit_id], function (err, res) {
                        if (err) throw err;
                        resolve(res);
                    });
                });
                var lastUpdateDateString = result[0].habit_last_update;
                var keepRecord = result[0].habit_keep_record;
                var lastUpdateDate = new Date(lastUpdateDateString);
                var daysNum = Math.floor((today.getTime() - lastUpdateDate.getTime()) / (24 * 60 * 60 * 1000));
                console.log('days: ', daysNum);
                keepRecord = (keepRecord << daysNum) + 1;

                var editQuery = 'UPDATE UserHabits SET habit_last_update = ?, habit_keep_record = ? WHERE habit_id = ?';
                await new Promise((resolve, reject) => {
                    conn.query(editQuery, [todayString, keepRecord, habit_id], function (err) {
                        if (err) throw err;
                        resolve();
                    });
                });

                var selectQuery1 = 'SELECT score FROM UserInfo WHERE user_name = ?';
                result = await new Promise((resolve, reject) => {
                    conn.query(selectQuery1, [user_name], function (err, res) {
                        if (err) throw err;
                        resolve(res);
                    });
                });
                var score = result[0].score + 4;
                score = score > 1073741824 ? 1073741824 : score;
                var editQuery1 = 'UPDATE UserInfo SET score = ? WHERE user_name = ?';
                await new Promise((resolve, reject) => {
                    conn.query(editQuery1, [score, user_name], function (err) {
                        if (err) throw err;
                        resolve();
                    });
                });

            } catch (error) {
                console.error('An error occurred:', error);
            } finally {
                conn.end();
            }
        })();
    },
    getOtherHabit: async (username, callback) => {
        const conn = getConn();
        var userGetSql = 'SELECT habit_id, user_name, user_habit, habit_keep_record, habit_last_update, star_num, habit_begin_date, habit_end_date, habit_week FROM UserHabits WHERE user_name != ? AND is_open = TRUE ORDER BY RAND() LIMIT 1';


        conn.query(userGetSql, [username], function (err, result) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                conn.end();
                return callback(-1);
            }
            conn.end();
            return callback(result);
        });
    },
    giveStar: async (id, num, callback) => {
        const conn = getConn();
        var userGetSql = 'UPDATE UserHabits SET star_num = ? WHERE habit_id = ?';


        conn.query(userGetSql, [num, id], function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                conn.end();
                return callback(-1);
            }
            conn.end();
            return callback(0);
        });
    },
    getRanking: async (user_name, callback) => {
        let conn;
        try {
            conn = getConn();

            var top20Sql = 'SELECT user_name, score FROM UserInfo ORDER BY score DESC LIMIT 20;';
            var myScoreSql = 'SELECT score FROM UserInfo WHERE user_name = ?;';
            var myRankSql = `
SELECT COUNT(*) + 1 AS myRank FROM ( SELECT DISTINCT score FROM UserInfo WHERE score > ?) AS higherScores;
`;
            const top20Result = await new Promise((resolve, reject) => {
                conn.query(top20Sql, [], function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            const [myScoreResult] = await new Promise((resolve, reject) => {
                conn.query(myScoreSql, [user_name], function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            const [myRankResult] = await new Promise((resolve, reject) => {
                conn.query(myRankSql, [myScoreResult], function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            callback(top20Result, myScoreResult, myRankResult);

        } catch (err) {
            console.log('[GET RANK ERROR] - ', err.message);

            callback(-1, -1, -1);
        } finally {
            conn.end();
        }
    },
}
module.exports = user_service;