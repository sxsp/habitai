import 'package:flutter/material.dart';
import 'package:hiai/BottomNavi.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SignPage extends StatefulWidget {
  @override
  _SignPageState createState() => _SignPageState();
}

class _SignPageState extends State<SignPage> {
  final Dio _dio = Dio();

  String _user_name = "";
  String _password1 = "";
  String _password2 = "";

  final _user_nameController = TextEditingController();
  final _password1Controller = TextEditingController();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _user_nameController.dispose();
    _password1Controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenWidth = MediaQuery.of(context).size.width;
    const Color backgroundColor = Color.fromARGB(255, 57, 197, 187);

    return Scaffold(
      resizeToAvoidBottomInset: false,
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
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: screenWidth * 0.8),
                  child: TextField(
                    controller: _user_nameController,
                    onSubmitted: (value) {
                      setState(() {
                        _user_name = value;
                      });
                    },
                    maxLength: 20,
                    style: const TextStyle(
                      fontSize: 30,
                      color: Colors.white,
                      shadows: [
                        Shadow(
                          color: Color.fromARGB(202, 0, 0, 0),
                          offset: Offset(2, 0),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    decoration: const InputDecoration(
                      labelText: "name",
                      counterText: "",
                      labelStyle: TextStyle(
                          fontSize: 30,
                          color: Color.fromARGB(255, 231, 255, 253)),
                      enabledBorder: UnderlineInputBorder(
                        borderSide:
                            BorderSide(color: Color.fromARGB(255, 0, 0, 0)),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(
                            color: Color.fromARGB(255, 255, 255, 255)),
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: screenWidth * 0.8),
                  child: TextField(
                    controller: _password1Controller,
                    onSubmitted: (value) {
                      setState(() {
                        _password1 = value;
                      });
                    },
                    maxLength: 20,
                    style: const TextStyle(
                      fontSize: 30,
                      color: Colors.white,
                      shadows: [
                        Shadow(
                          color: Color.fromARGB(202, 0, 0, 0),
                          offset: Offset(2, 0),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    obscureText: true,
                    decoration: const InputDecoration(
                      labelText: "password",
                      counterText: "",
                      labelStyle: TextStyle(
                          fontSize: 30,
                          color: Color.fromARGB(255, 231, 255, 253)),
                      enabledBorder: UnderlineInputBorder(
                        borderSide:
                            BorderSide(color: Color.fromARGB(255, 0, 0, 0)),
                      ),
                      focusedBorder: UnderlineInputBorder(
                        borderSide: BorderSide(
                            color: Color.fromARGB(255, 255, 255, 255)),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(
                height: 50,
              ),
              ElevatedButton(
                onPressed: () {
                  signIn(_user_nameController.text, _password1Controller.text);
                },
                style: ButtonStyle(
                  minimumSize: MaterialStateProperty.all<Size>(
                      Size(screenWidth * 0.3, 70)),
                ),
                child: const Text('SIGN IN',
                    style: TextStyle(
                      fontSize: 20,
                      color: Color.fromARGB(255, 57, 197, 187),
                    )),
              ),
              const SizedBox(
                height: 200,
              )
            ],
          ),
        ),
      ),
    );
  }

  Future<void> signIn(usern, passw) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    // var bea = (prefs.getInt('token') ?? "null");
    // if (bea == "null") {
    //   // to sign in
    // }

    try {
      Response response = await _dio.post(
          'http://123.249.92.54:10000/adminapi/user/signin',
          data: {'username': usern, 'password': passw});
      if (response.data['code'] == "400") {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Incorrect password!'),
            backgroundColor: Color.fromARGB(255, 255, 127, 118),
            duration: Duration(seconds: 3),
          ),
        );
      } else if (response.data['ActionType'] == "OK") {
        await prefs.setString('token', response.data['token']);
        await prefs.setString('cur_user', usern);
        // ignore: use_build_context_synchronously
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const BottomNavi()),
          (Route<dynamic> route) => false,
        );
      } else {
        // ignore: use_build_context_synchronously
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('SERVER ERROR...'),
            backgroundColor: Color.fromARGB(255, 255, 127, 118),
            duration: Duration(seconds: 3),
          ),
        );
      }
    } catch (e) {
      print('Request failed: $e');
    }
  }
}
