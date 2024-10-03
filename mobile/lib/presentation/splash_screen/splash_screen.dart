import 'controller/splash_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';

class SplashScreen extends GetWidget<SplashController> {
  const SplashScreen({Key? key, this.appState}) : super(key: key);
  final AppStateNotifier? appState;

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            backgroundColor: Colors.white,
            body: SizedBox(
                width: double.maxFinite,
                child: CustomImageView(
                    imagePath: ImageConstant.imgLogo,
                    height: getVerticalSize(153),
                    width: getHorizontalSize(102),
                    alignment: Alignment.center,
                    margin: getMargin(bottom: 5)))));
  }
}
