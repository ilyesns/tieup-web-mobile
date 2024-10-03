import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/firebase_auth.dart';
import 'package:Tieup/presentation/sign_up_create_acount_screen/models/sign_up_create_acount_model.dart';
import 'package:flutter/material.dart';

/// A controller class for the SignUpCreateAcountScreen.
///
/// This class manages the state of the SignUpCreateAcountScreen, including the
/// current signUpCreateAcountModelObj
class ForgetPasswordController extends GetxController {
  TextEditingController emailController = TextEditingController();

  forgetPassword() async {
    ProgressDialogUtils.showProgressDialog();
    try {
      ApiClient().isNetworkConnected();
      await AuthManager().forgetPassword(emailController.text.trim());
      ProgressDialogUtils.hideProgressDialog();

      Get.rawSnackbar(
          backgroundColor: theme.colorScheme.primary,
          messageText: Text(
            "Check your inbox, we've sent you an email to reset your password.",
            style: TextStyle(color: Colors.white),
          ));
    } on NetworkException {
      Get.rawSnackbar(message: 'No Internet Connection');
      rethrow;
    } catch (e) {
      ProgressDialogUtils.hideProgressDialog();
      Get.rawSnackbar(message: e.toString());
    }
  }

  @override
  void onClose() {
    super.onClose();
    emailController.dispose();
  }
}
