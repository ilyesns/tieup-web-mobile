import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/splash_screen/models/splash_model.dart';

/// A controller class for the SplashScreen.
///
/// This class manages the state of the SplashScreen, including the
/// current splashModelObj
class SplashController extends GetxController {
  Rx<SplashModel> splashModelObj = SplashModel().obs;

  final AppStateNotifier appState = AppStateNotifier.instance;
  @override
  void onReady() {
    Future.delayed(const Duration(seconds: 3), () {
      // Data fetched, navigate based on authentication state
      if (appState.loggedIn) {
        Get.offNamed(AppRoutes.homeContainerScreen);
      } else {
        Get.offNamed(AppRoutes.onboardingOneScreen);
      }
    });
  }
}
