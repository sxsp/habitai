function getAIAnswer(res, my_question, habits) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const APIKey = '2e005a1a5d7edf6feb15f7191111cb99';
    const APISecret = 'YzMzZTI1YmNkNzYzMjMxMzBkZmZiNjE2';
    const APIId = 'ea8bdbb5';
    console.log(my_question);
    let questionValue = '';

    const crypto = require('crypto');
    const WebSocket = require('ws');

    const dateString = new Date().toGMTString();


    const host = 'spark-api.xf-yun.com';
    const path = '/v4.0/chat';
    let tmp = `host: ${host}\ndate: ${dateString}\nGET ${path} HTTP/1.1`;


    let signature = crypto
        .createHmac('sha256', APISecret)
        .update(tmp)
        .digest('base64');

    const authorization_origin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;

    // to Base64
    let buff = Buffer.from(authorization_origin);
    const authorization = buff.toString('base64');

    // API's WebSocket URL
    const signUrl = `wss://${host}${path}?authorization=${authorization}&date=${encodeURIComponent(dateString)}&host=${host}`;

    // WebSocket connect
    let sock = new WebSocket(signUrl);

    let today = new Date();
    let today_yyyymmdd = today.getFullYear() + '-' +
        ('0' + (today.getMonth() + 1)).slice(-2) + '-' +
        ('0' + today.getDate()).slice(-2);
    let weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
    let today_week = weeks[today.getDay()];
    let habit_list = ''
    for (let i = 0; i < habits.length; i++) {
        habit_list = habit_list + (i + 1) + '. from ' + habits[i].habit_begin_date + ' to ' + habits[i].habit_end_date + ', '
        if (habits[i].habit_week === 127) {
            habit_list = habit_list + 'everyday, '
        }
        else {
            habit_list = habit_list + 'every '
            for (let j = 0; j < 7; j++) {
                if (habits[i].habit_week & (1 << j)) {
                    habit_list = habit_list + weeks[j] + ', '
                }
            }
        }
        habit_list = habit_list + habits[i].user_habit + ', ' + habits[i].habit_start_time + ', ' + habits[i].habit_dur_time + 'min; '
    }


    sock.on('open', function () {
        console.log('connect success');
        sock.send(
            JSON.stringify({
                header: {
                    app_id: APIId,
                },
                parameter: {
                    chat: {
                        // domain: 'generalv3.5',
                        domain: '4.0Ultra',
                        temperature: 0.5,
                        max_tokens: 1024,
                    },
                },
                payload: {
                    message: {
                        text: [
                            {
                                role: 'system',
                                content: 'You\'re a bot that helps me keep my habits going, You are lively and cute and your name is HabitAI.',
                            },
                            {
                                role: 'system',
                                content: 'Here are my habits: ' + habit_list,
                            },

                            {
                                role: 'system',
                                content: 'Today: ' + today_yyyymmdd + ', ' + today_week + '. ' + 'Pay attention to the start and end dates of each habit. I don\'t need to do the habit when the date is not between the start and end dates of a habit. ',
                            },
                            {
                                role: 'system',
                                content: 'Try to be concise in your answers each time, and don\'t say things that you don\'t need to say.',
                            },
                            {
                                role: 'user',
                                content: my_question,
                            },
                        ],
                    }
                },
            })
        );
    });

    // error
    sock.on('error', function (err) {
        console.log('error: ', err);
        reject(err);
    });


    sock.on('message', function (data) {
        const obj = JSON.parse(data);
        const texts = obj.payload.choices.text;
        texts.forEach((item) => {
            questionValue += item.content;
            res.write(`data: ${encodeURIComponent(item.content)}\n\n`);
            res.flush();
        });
    });

    sock.on('close', function () {
        console.log('result: ', questionValue)
        res.end();
    });
}

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

const getHabit = async (username, callback) => {

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
}

module.exports = getAIAnswer;