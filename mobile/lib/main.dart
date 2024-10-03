import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:Tieup/core/utils/network_status_listener.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/firebase/base_user_provider.dart';
import 'package:Tieup/firebase/firebase_config.dart';
import 'package:Tieup/firebase/firebase_user_provider.dart';

import 'core/app_export.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initFirebase();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]).then((value) {
    Logger.init(kReleaseMode ? LogMode.live : LogMode.debug);
    runApp(MyApp());
  });
}

class MyApp extends StatefulWidget {
  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  late Stream<BaseAuthUser> userStream;
  late AppStateNotifier _appStateNotifier;
  late AppRoutes _routes;
  final authUserSub = authenticatedUserStream.listen((_) {});

  @override
  void initState() {
    super.initState();
    _appStateNotifier = AppStateNotifier.instance;
    userStream = tieupFirebaseUserStream()
      ..listen((user) => _appStateNotifier.update(user));
    jwtTokenStream.listen((_) {});
    _routes = AppRoutes(appStateNotifier: _appStateNotifier);
  }

  @override
  void dispose() {
    authUserSub.cancel();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      debugShowCheckedModeBanner: false,
      theme: theme,
      translations: AppLocalization(),
      locale: Get.deviceLocale, //for setting localization strings
      fallbackLocale: Locale('en', 'US'),
      title: 'tieup',
      initialBinding: InitialBindings(),
      initialRoute: AppRoutes.initialRoute,
      getPages: _routes.getPages(),
      builder: (context, child) {
        return Stack(
          children: [
            child ?? SizedBox(), // Ensure child is not null
            NetworkStatusListener(), // Your network status checking widget
          ],
        );
      },
    );
  }
}
