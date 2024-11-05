import 'package:flutter/material.dart';
import 'package:hiai/pages/Habits.dart';
import 'package:hiai/pages/Info.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'dart:convert';
import 'package:background_fetch/background_fetch.dart';
import 'package:hiai/common/Noti.dart';

class BottomNavi extends StatefulWidget {
  const BottomNavi({super.key});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".
  @override
  State<BottomNavi> createState() => _BottomNaviState();
}

class _BottomNaviState extends State<BottomNavi> {
  // int _counter = 0;

  // void _incrementCounter() {
  //   setState(() {
  //     // This call to setState tells the Flutter framework that something has
  //     // changed in this State, which causes it to rerun the build method below
  //     // so that the display can reflect the updated values. If we changed
  //     // _counter without calling setState(), then the build method would not be
  //     // called again, and so nothing would appear to happen.
  //     _counter++;
  //   });
  // }
  @override
  void initState() {
    super.initState();
    getHabits();
  }

  @override
  void dispose() {
    initPlatformState();
    startBackgroundFetch();
    super.dispose();
  }

  final NotificationHelper _notificationHelper = NotificationHelper();

//---------------------------------------------------------------------------------------------------------------------------- bottom items
  final List<BottomNavigationBarItem> bottomNavItems = [
    const BottomNavigationBarItem(
      backgroundColor: Color.fromARGB(255, 72, 126, 170),
      icon: Icon(Icons.view_list),
      label: "HABITS",
    ),
    const BottomNavigationBarItem(
      backgroundColor: Color.fromARGB(255, 175, 171, 108),
      icon: Icon(Icons.mood),
      label: "INFO",
    ),
  ];
  int currentPageIndex = 1;
  final pages = [const HabitsListPage(), const UserInfoPage()];

//---------------------------------------------------------------------------------------------------------------------------- get habits
  List<Map<String, dynamic>> myHabits = [];
  final Dio _dio = Dio();
  Future<void> getHabits() async {
    Database myDB = await createDB();
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var bea = (prefs.getString('token') ?? "null");
    var options = Options(headers: {
      'Authorization': 'Bearer $bea',
    });
    try {
      Response response = await _dio.get(
          'http://123.249.92.54:10000/adminapi/user/browsehabits',
          options: options);

      if (response.statusCode == 200) {
        for (int i = 0; i < response.data['body'].length; i++) {
          myHabits.add({
            "user_name": response.data['body'][i]['user_name'],
            "habit_id": response.data['body'][i]['habit_id'],
            "user_habit": response.data['body'][i]['user_habit'],
            "habit_week": response.data['body'][i]['habit_week'],
            "habit_begin_date": response.data['body'][i]['habit_begin_date'],
            "habit_end_date": response.data['body'][i]['habit_end_date'],
            "habit_start_time": response.data['body'][i]['habit_start_time'],
            "habit_dur_time": response.data['body'][i]['habit_dur_time'],
            "habit_keep_record": response.data['body'][i]['habit_keep_record'],
            "habit_last_update": response.data['body'][i]['habit_last_update'],
            "is_complete": response.data['body'][i]['is_complete'],
            "is_open": response.data['body'][i]['is_open'],
            "star_num": response.data['body'][i]['star_num'],
          });
        }
        setState(() {});
        await insertData(myDB, myHabits);
      } else {
        print('Request failed with status: ${response.statusCode}.');
      }
    } catch (e) {
      print('Request failed: $e');
    }
  }

//---------------------------------------------------------------------------------------------------------------------------- create db
  Future<Database> createDB() async {
    var databasesPath = await getDatabasesPath();
    String path = join(databasesPath, 'note.db');
    return openDatabase(path, version: 1,
        onCreate: (Database db, int version) async {
      String createTableHabits = '''
CREATE TABLE IF NOT EXISTS UserHabits (
  user_name TEXT,
  habit_id INTEGER PRIMARY KEY,
  user_habit TEXT,
  habit_week TINYINT UNSIGNED,
  habit_begin_date TEXT,
  habit_end_date TEXT,
  habit_start_time TEXT,
  habit_dur_time INTEGER,
  habit_keep_record INTEGER,
  habit_last_update TEXT,
  is_complete INTEGER,
  is_open INTEGER,
  star_num TINYINT UNSIGNED
)
''';
      await db.execute(createTableHabits);
      final List<String> tables = (await db.rawQuery(
              'SELECT name FROM sqlite_master WHERE type="table" AND name="UserHabits"'))
          .cast<String>();
      if (tables.isEmpty) {
        print("empty");
      } else {
        print("not empty");
      }
    });
  }

//---------------------------------------------------------------------------------------------------------------------------- save habits to db
  Future<void> insertData(
      Database db, List<Map<String, dynamic>> myData) async {
    for (var item in myData) {
      await db.insert('UserHabits', item,
          conflictAlgorithm: ConflictAlgorithm.replace);
    }
  }

//---------------------------------------------------------------------------------------------------------------------------- build page
  @override
  Widget build(BuildContext context) {
    return PopScope(
        canPop: true,
        child: Scaffold(
          bottomNavigationBar: BottomNavigationBar(
            items: bottomNavItems,
            currentIndex: currentPageIndex,
            type: BottomNavigationBarType.shifting,
            onTap: (index) {
              _changePage(index);
            },
          ),
          body: pages[currentPageIndex],
        ));
  }

  void _changePage(int index) {
    if (index != currentPageIndex) {
      setState(() {
        currentPageIndex = index;
      });
    }
  }

  void startBackgroundFetch() {
    BackgroundFetch.start().then((int status) {
      print('[BackgroundFetch] start success: $status');
    }).catchError((e) {
      print('[BackgroundFetch] start FAILURE: $e');
    });
  }

  Future<void> initPlatformState() async {
    int status = await BackgroundFetch.configure(
      BackgroundFetchConfig(
          minimumFetchInterval: 15,
          stopOnTerminate: false,
          enableHeadless: true,
          requiresBatteryNotLow: false,
          requiresCharging: false,
          requiresStorageNotLow: false,
          requiresDeviceIdle: false,
          requiredNetworkType: NetworkType.ANY),
      (String taskId) async {
        // <-- Event handler
        // ...
        switch (taskId) {
          case 'habitRemind':
            {
              print(DateTime.now());
              _notificationHelper.showNotification(
                title: DateTime.now().toString(),
                body: 'This is a notification!',
              );
            }
            break;
        }
        BackgroundFetch.finish(taskId);
      },
      (String taskId) async {
        // <-- Task timeout handler
        // ...
      },
    );
    BackgroundFetch.scheduleTask(TaskConfig(
        taskId: 'habitRemind',
        delay: 5000,
        forceAlarmManager: true,
        stopOnTerminate: false,
        enableHeadless: true,
        requiresBatteryNotLow: false,
        requiresCharging: false,
        requiresStorageNotLow: false,
        requiresDeviceIdle: false,
        requiredNetworkType: NetworkType.ANY,
        periodic: true));
    print('[BackgroundFetch] configure success: $status');

    if (!mounted) return;
  }

  int totalMinutes(i) {
    List<String> parts = myHabits[i]["habit_week"].split(":");
    int hours = int.parse(parts[0]);
    int minutes = int.parse(parts[1]);
    int totalMinutes = hours * 60 + minutes;
    return totalMinutes;
  }

  bool isGoing(i, is_tomo) {
    DateTime nowTime = DateTime.now();
    if (is_tomo) {
      nowTime = nowTime.add(Duration(days: 1));
    }
    DateTime? beginD = DateTime.tryParse(myHabits[i]["habit_begin_date"]);
    DateTime? endD = DateTime.tryParse(myHabits[i]["habit_end_date"]);
    if (beginD != null && endD != null) {
      return nowTime.isAfter(beginD) && nowTime.isBefore(endD);
    } else {
      return false;
    }
  }

  void checkHabitRemind() {
    DateTime nowTime = DateTime.now();
    DateTime tomoTime = nowTime.add(Duration(days: 1));
    int nowWeekday = nowTime.weekday % 7;
    int tomoWeekday = (nowWeekday + 1) % 7;
    int nowMin = nowTime.hour * 60 + nowTime.minute;
    for (int i = 0; i < myHabits.length; i++) {
      if (nowMin < 1425) {
        if (myHabits[i]["habit_week"] & (1 << nowWeekday) != 0 &&
            isGoing(i, false) &&
            (nowMin <= totalMinutes(i)) &&
            (nowMin + 15 > totalMinutes(i))) {
          _notificationHelper.showNotification(
            title: myHabits[i]["user_habit"],
            body:
                "${myHabits[i]["habit_start_time"]} ${myHabits[i]["habit_dur_time"].toString()}min",
          );
        }
      } else {
        if (totalMinutes(i) > 1425) {
          if (myHabits[i]["habit_week"] & (1 << nowWeekday) != 0 &&
              isGoing(i, false)) {
            _notificationHelper.showNotification(
              title: myHabits[i]["user_habit"],
              body:
                  "${myHabits[i]["habit_start_time"]} ${myHabits[i]["habit_dur_time"].toString()}min",
            );
          }
        } else if (totalMinutes(i) < 15 &&
            myHabits[i]["habit_week"] & (1 << tomoWeekday) != 0 &&
            isGoing(i, true)) {
          _notificationHelper.showNotification(
            title: myHabits[i]["user_habit"],
            body:
                "${myHabits[i]["habit_start_time"]} ${myHabits[i]["habit_dur_time"].toString()}min",
          );
        }
      }
    }
  }
}
