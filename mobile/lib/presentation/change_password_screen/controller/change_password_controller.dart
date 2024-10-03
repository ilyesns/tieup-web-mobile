import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/firebase_auth.dart';
import 'package:flutter/material.dart';

/// A controller class for the SignUpCreateAcountScreen.
///
/// This class manages the state of the SignUpCreateAcountScreen, including the
/// current signUpCreateAcountModelObj
class ChangePasswordController extends GetxController {
  TextEditingController passwordController = TextEditingController();

  changePassword() async {
    ProgressDialogUtils.showProgressDialog();
    try {
      ApiClient().isNetworkConnected();
      await AuthManager().changePassword(passwordController.text);
      ProgressDialogUtils.hideProgressDialog();
      passwordController.text = '';
      Get.rawSnackbar(
          backgroundColor: theme.colorScheme.primary,
          messageText: Text(
            "Password updated successfully.",
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
    passwordController.dispose();
  }
}
