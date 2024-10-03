import 'package:get/get.dart';
import 'package:Tieup/presentation/forget_password_screen/controller/forget_password_controller.dart';

/// A binding class for the SignUpCreateAcountScreen.
///
/// This class ensures that the SignUpCreateAcountController is created when the
/// SignUpCreateAcountScreen is first loaded.
class ForgetPasswordBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => ForgetPasswordController());
  }
}
