// ignore_for_file: use_build_context_synchronously

import 'dart:convert';

import 'package:amazon_clone_app/constants/error_handling.dart';
import 'package:amazon_clone_app/constants/global_variables.dart';
import 'package:amazon_clone_app/constants/utils.dart';
import 'package:amazon_clone_app/features/home/screens/home_screen.dart';
import 'package:amazon_clone_app/models/user.dart';
import 'package:amazon_clone_app/providers/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  //signup user
  void signUpUser(
      {required email,
      required password,
      required name,
      required BuildContext context}) async {
    try {
      User user = User(
          id: '',
          name: name,
          password: password,
          email: email,
          address: '',
          type: '',
          token: '');

      http.Response res = await http.post(
        Uri.parse("$uri/api/signup"),
        body: user.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandler(
          response: res,
          context: context,
          onSuccess: () {
            showSnackBar(
                context, "Account created! Login with the same credentials!");
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  //signin user
  void signInUser(
      {required email,
      required password,
      required BuildContext context}) async {
    try {
      http.Response res = await http.post(
        Uri.parse("$uri/api/signin"),
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandler(
          response: res,
          context: context,
          onSuccess: () async {
            SharedPreferences prefs = await SharedPreferences.getInstance();
            Provider.of<UserProvider>(context, listen: false).setUser(res.body);
            await prefs.setString(
                'x-auth-token', jsonDecode(res.body)['token']);
            Navigator.pushNamedAndRemoveUntil(
                context, HomeScreen.routeName, (route) => false);
          });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  void getUserData(BuildContext context) async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? token = prefs.getString('x-auth-token');

      if (token == null) {
        prefs.setString('x-auth-token', '');
      }

      var tokenRes = await http.post(
        Uri.parse("$uri/api/tokenIsValid"),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': token!,
        },
      );

      var response = jsonDecode(tokenRes.body);

      if (response == true) {
        //get user data
      }
      // http.Response res = await http.post(
      //   Uri.parse("$uri/api/signin"),
      //   body: jsonEncode({
      //     'email': email,
      //     'password': password,
      //   }),
      //   headers: <String, String>{
      //     'Content-Type': 'application/json; charset=UTF-8',
      //   },
      // );

      // httpErrorHandler(
      //     response: res,
      //     context: context,
      //     onSuccess: () async {
      //       SharedPreferences prefs = await SharedPreferences.getInstance();
      //       Provider.of<UserProvider>(context, listen: false).setUser(res.body);
      //       await prefs.setString(
      //           'x-auth-token', jsonDecode(res.body)['token']);
      //       Navigator.pushNamedAndRemoveUntil(
      //           context, HomeScreen.routeName, (route) => false);
      //     });
    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
