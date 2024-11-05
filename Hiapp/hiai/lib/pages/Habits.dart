import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class HabitsListPage extends StatefulWidget {
  const HabitsListPage({super.key});

  @override
  State<HabitsListPage> createState() => _HabitsListState();
}

class _HabitsListState extends State<HabitsListPage> {
  List<Map<String, dynamic>> myHabits = [];

  @override
  void initState() {
    super.initState();
    getDbHabits();
  }

  // get habits from db
  Future<void> getDbHabits() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var cur_user = (prefs.getString('cur_user') ?? "null");
    var databasesPath = await getDatabasesPath();
    String path = join(databasesPath, 'note.db');
    Database db = await openDatabase(path, version: 1);

    final String query_where = 'user_name = "$cur_user"';
    final List<Map<String, dynamic>> results =
        await db.query('UserHabits', where: query_where);
    setState(() {
      myHabits = results;
    });
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    List<Widget> cards = List.generate(
      myHabits.length,
      (index) => Container(
        width: screenWidth * 0.90,
        child: Card(
            color: Color.fromARGB(255, 255, 253, 253),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 10),
                Text(
                  myHabits[index]["user_habit"],
                  style: const TextStyle(
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 70, 70, 70),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  " ${(myHabits[index]["habit_week"] & 1) != 0 ? "SUN " : " "}${(myHabits[index]["habit_week"] & 2) != 0 ? "MON " : " "}${(myHabits[index]["habit_week"] & 4) != 0 ? "TUE " : " "}${(myHabits[index]["habit_week"] & 8) != 0 ? "WEN " : " "}${(myHabits[index]["habit_week"] & 16) != 0 ? "THU " : " "}${(myHabits[index]["habit_week"] & 32) != 0 ? "FRI " : " "}${(myHabits[index]["habit_week"] & 64) != 0 ? "SAT " : " "}",
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 77, 77, 77),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text("from "),
                    Text(
                      myHabits[index]["habit_begin_date"],
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 49, 202, 176),
                      ),
                    ),
                    Text(" to "),
                    Text(
                      myHabits[index]["habit_end_date"],
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 49, 159, 202),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "${myHabits[index]["habit_start_time"]}   ${myHabits[index]["habit_dur_time"].toString()}",
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 49, 202, 176),
                      ),
                    ),
                    const Text(
                      "min",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
              ],
            )),
      ),
    );

    return Container(
        width: screenWidth,
        child: ListView(
          children: <Widget>[
            Column(
              children: [
                SizedBox(
                  height: 20,
                ),
                Column(children: [
                  Container(
                    width: screenWidth * 0.90,
                    child: Card(
                        color: Color.fromARGB(255, 255, 253, 253),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const SizedBox(height: 10),
                            Text(
                              "exercise",
                              style: const TextStyle(
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                color: Color.fromARGB(255, 70, 70, 70),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              " ${1 != 0 ? "SUN " : " "}${1 != 0 ? "MON " : " "}${1 != 0 ? "TUE " : " "}${1 != 0 ? "WEN " : " "}${1 != 0 ? "THU " : " "}${1 != 0 ? "FRI " : " "}${1 != 0 ? "SAT " : " "}",
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color.fromARGB(255, 77, 77, 77),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text("from "),
                                Text(
                                  "2024-07-12",
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 49, 202, 176),
                                  ),
                                ),
                                Text(" to "),
                                Text(
                                  "2024-08-12",
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 49, 159, 202),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "18:00   60",
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 49, 202, 176),
                                  ),
                                ),
                                const Text(
                                  "min",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                          ],
                        )),
                  ),
                  Container(
                    width: screenWidth * 0.90,
                    child: Card(
                        color: Color.fromARGB(255, 255, 253, 253),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const SizedBox(height: 10),
                            Text(
                              "study",
                              style: const TextStyle(
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                color: Color.fromARGB(255, 70, 70, 70),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              " ${0 != 0 ? "SUN " : " "}${1 != 0 ? "MON " : " "}${1 != 0 ? "TUE " : " "}${1 != 0 ? "WEN " : " "}${1 != 0 ? "THU " : " "}${1 != 0 ? "FRI " : " "}${0 != 0 ? "SAT " : " "}",
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Color.fromARGB(255, 77, 77, 77),
                              ),
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text("from "),
                                Text(
                                  "2024-06-26",
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 49, 202, 176),
                                  ),
                                ),
                                Text(" to "),
                                Text(
                                  "2024-09-01",
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 49, 159, 202),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  "20:00   60",
                                  style: const TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Color.fromARGB(255, 49, 202, 176),
                                  ),
                                ),
                                const Text(
                                  "min",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                          ],
                        )),
                  ),
                ]),
              ],
            )
          ],
        ));
  }
}
