import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:hiai/pages/Sign.dart';
import 'package:hiai/common/Noti.dart';

class UserInfoPage extends StatefulWidget {
  const UserInfoPage({super.key});

  @override
  State<UserInfoPage> createState() => _UserInfoState();
}

class _UserInfoState extends State<UserInfoPage> {
  String name = "";
  final NotificationHelper _notificationHelper = NotificationHelper();
  void signOut() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.remove('token');
    prefs.remove('cur_user');
    // ignore: use_build_context_synchronously
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => SignPage()),
    );
  }

  @override
  void initState() {
    super.initState();
    getName();
  }

  Future<void> getName() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    name = (prefs.getString('cur_user') ?? "null");
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Center(
        child: Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(name,
            style: const TextStyle(
              fontSize: 40,
              color: Color.fromARGB(255, 22, 22, 22),
            )),
        const SizedBox(
          height: 50,
        ),
        ElevatedButton(
          onPressed: () {
            signOut();
          },
          style: ButtonStyle(
            backgroundColor:
                MaterialStateProperty.all(Color.fromARGB(255, 255, 255, 255)),
            minimumSize: MaterialStateProperty.all<Size>(Size(200, 70)),
          ),
          child: const Text('SIGN OUT',
              style: TextStyle(
                fontSize: 20,
                color: Color.fromARGB(137, 197, 73, 57),
              )),
        )
      ],
    ));
  }
}
