import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:hiai/pages/Sign.dart';
import 'package:hiai/BottomNavi.dart';

class OpeningPage extends StatefulWidget {
  @override
  _OpeningPageState createState() => _OpeningPageState();
}

class _OpeningPageState extends State<OpeningPage> {
  final Dio _dio = Dio();

  @override
  void initState() {
    super.initState();
    sendRequestToBackend();
  }

  Future<void> sendRequestToBackend() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var bea = (prefs.getString('token') ?? "null");
    if (bea == "null") {
      // ignore: use_build_context_synchronously
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => SignPage()),
        (Route<dynamic> route) => false,
      );
    } else {
      // ignore: use_build_context_synchronously
      // Navigator.push(
      //   context,
      //   MaterialPageRoute(builder: (context) => const BottomNavi()),
      // );
      // ignore: use_build_context_synchronously
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => const BottomNavi()),
        (Route<dynamic> route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const Color backgroundColor = Color.fromARGB(255, 57, 197, 187);

    return Scaffold(
      body: Container(
        color: backgroundColor,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Transform(
                transform: Matrix4.skewX(-0.1),
                child: const Text('HiAI',
                    style: TextStyle(
                        color: Colors.white,
                        shadows: [
                          Shadow(
                            color: Color.fromARGB(202, 0, 0, 0),
                            offset: Offset(4, 0),
                            blurRadius: 0,
                          ),
                        ],
                        fontSize: 60,
                        fontWeight: FontWeight.bold,
                        height: 2)),
              ),
              Transform(
                transform: Matrix4.skewX(-0.1),
                child: const Text('- your habit assistant -',
                    style: TextStyle(
                        fontSize: 20, color: Color.fromARGB(134, 0, 0, 0))),
              ),
              const SizedBox(
                height: 150,
              )
            ],
          ),
        ),
      ),
    );
  }
}
