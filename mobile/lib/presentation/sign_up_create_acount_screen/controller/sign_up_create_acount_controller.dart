import 'package:flutter/scheduler.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/confirmation_dialog/confirmation_dialog.dart';
import 'package:Tieup/presentation/confirmation_dialog/controller/confirmation_controller.dart';
import 'package:Tieup/presentation/sign_up_create_acount_screen/models/sign_up_create_acount_model.dart';
import 'package:flutter/material.dart';

/// A controller class for the SignUpCreateAcountScreen.
///
/// This class manages the state of the SignUpCreateAcountScreen, including the
/// current signUpCreateAcountModelObj
class SignUpCreateAcountController extends GetxController {
  TextEditingController emailController = TextEditingController();

  Rx<SignUpCreateAcountModel> signUpCreateAcountModelObj =
      SignUpCreateAcountModel().obs;

  @override
  void onReady() {
    // TODO: implement onReady
    super.onReady();
    SchedulerBinding.instance.addPostFrameCallback((timeStamp) {
      initConfirmationPolicy();
    });
  }

  initConfirmationPolicy() async {
    final result = await PrefUtils().getAgreementPolicy();
    if (!result)
      Get.bottomSheet(
        ConfirmationDialog(
          Get.put(ConfirmationController()),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        isDismissible: true,
        enableDrag: false,
        isScrollControlled: true,
        enterBottomSheetDuration: Duration(milliseconds: 200),
        exitBottomSheetDuration: Duration(milliseconds: 200),
      );
  }

  @override
  void onClose() {
    super.onClose();
    emailController.dispose();
  }
}
