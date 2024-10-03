import 'package:get/get.dart';
import 'package:Tieup/presentation/change_password_screen/controller/change_password_controller.dart';

/// A binding class for the SignUpCreateAcountScreen.
///
/// This class ensures that the SignUpCreateAcountController is created when the
/// SignUpCreateAcountScreen is first loaded.
class ChangePasswordBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => ChangePasswordController());
  }
}
