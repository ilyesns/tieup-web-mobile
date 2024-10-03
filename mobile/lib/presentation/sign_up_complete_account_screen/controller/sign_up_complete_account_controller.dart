import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/sign_up_complete_account_screen/models/sign_up_complete_account_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/data/models/registerDeviceAuth/post_register_device_auth_resp.dart';
import 'package:Tieup/data/apiClient/api_client.dart';

/// A controller class for the SignUpCompleteAccountScreen.
///
/// This class manages the state of the SignUpCompleteAccountScreen, including the
/// current signUpCompleteAccountModelObj
class SignUpCompleteAccountController extends GetxController {
  TextEditingController firstNameController = TextEditingController();

  TextEditingController lastNameController = TextEditingController();

  TextEditingController phoneNumberController = TextEditingController();

  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  Rx<SignUpCompleteAccountModel> signUpCompleteAccountModelObj =
      SignUpCompleteAccountModel().obs;
  FocusNode firstNameFocusNode = FocusNode();
  FocusNode lastNameFocusNode = FocusNode();
  FocusNode phoneNumberFocusNode = FocusNode();
  FocusNode passwordFocusNode = FocusNode();
  FocusNode confirmPasswordFocusNode = FocusNode();
  Rx<bool> isShowPassword = true.obs;
  Rx<bool> isShowConfirmPassword = true.obs;

  PostRegisterDeviceAuthResp postRegisterDeviceAuthResp =
      PostRegisterDeviceAuthResp();

  @override
  void onClose() {
    super.onClose();
    firstNameController.dispose();
    lastNameController.dispose();
    phoneNumberController.dispose();
    confirmPasswordController.dispose();
    passwordController.dispose();
  }

  /// handles the success response for the API
  void _handleRegisterDeviceAuthSuccess() {}
}
