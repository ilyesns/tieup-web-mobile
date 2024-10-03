import 'package:firebase_auth/firebase_auth.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/firebase_auth.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';

import 'controller/forget_password_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_outlined_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';
import 'package:Tieup/domain/googleauth/google_auth_helper.dart';

// ignore_for_file: must_be_immutable
class ForgetPasswordScreen extends GetWidget<ForgetPasswordController> {
  ForgetPasswordScreen({Key? key}) : super(key: key);

  GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            resizeToAvoidBottomInset: false,
            backgroundColor: appTheme.whiteA70002,
            body: Form(
                key: _formKey,
                child: Container(
                    width: double.maxFinite,
                    padding:
                        getPadding(left: 24, top: 13, right: 24, bottom: 13),
                    child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            mainAxisSize: MainAxisSize.max,
                            children: [
                              CustomImageView(
                                  svgPath: ImageConstant.imgGroup162799,
                                  height: getSize(24),
                                  width: getSize(24),
                                  alignment: Alignment.centerLeft,
                                  onTap: () {
                                    onTapImgImage();
                                  }),
                            ],
                          ),
                          Padding(
                              padding: getPadding(top: 44),
                              child: Text("Forget password".tr,
                                  style: theme.textTheme.headlineSmall)),
                          Padding(
                              padding: getPadding(left: 33, top: 26, right: 33),
                              child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                        padding: getPadding(top: 8, bottom: 8),
                                        child: SizedBox(
                                            width: getHorizontalSize(62),
                                            child: Divider())),
                                    Padding(
                                        padding: getPadding(left: 12),
                                        child: Text("Continue",
                                            style: CustomTextStyles
                                                .titleSmallBluegray300)),
                                    Padding(
                                        padding: getPadding(top: 8, bottom: 8),
                                        child: SizedBox(
                                            width: getHorizontalSize(74),
                                            child: Divider(
                                                indent: getHorizontalSize(12))))
                                  ])),
                          Align(
                              alignment: Alignment.centerLeft,
                              child: Padding(
                                  padding: getPadding(top: 28),
                                  child: Text("lbl_email".tr,
                                      style:
                                          CustomTextStyles.titleSmallPrimary))),
                          CustomTextFormField(
                              autofocus: false,
                              focusNode: FocusNode(),
                              controller: controller.emailController,
                              margin: getMargin(top: 9),
                              hintText: "msg_enter_your_email".tr,
                              hintStyle:
                                  CustomTextStyles.titleMediumBluegray400,
                              textInputAction: TextInputAction.done,
                              textInputType: TextInputType.emailAddress,
                              validator: (value) {
                                if (value == null ||
                                    (!isValidEmail(value.trim(),
                                        isRequired: true))) {
                                  return "Please enter valid email";
                                }
                                return null;
                              },
                              contentPadding: getPadding(
                                  left: 12, top: 15, right: 12, bottom: 15)),
                          CustomElevatedButton(
                              text: "Continue".tr,
                              margin: getMargin(top: 40),
                              buttonStyle: CustomButtonStyles.fillPrimary,
                              onTap: () {
                                if (_formKey.currentState!.validate()) {
                                  onTapContinuewith1();
                                }
                              }),
                          Padding(
                              padding: getPadding(left: 30, top: 28, right: 30),
                              child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text("msg_already_have_an".tr,
                                        style: CustomTextStyles
                                            .titleMediumBluegray300),
                                    GestureDetector(
                                        onTap: () {
                                          onTapTxtLargelabelmediu();
                                        },
                                        child: Padding(
                                            padding: getPadding(left: 3),
                                            child: Text("lbl_login".tr,
                                                style: theme
                                                    .textTheme.titleMedium)))
                                  ])),
                          Container(
                              width: getHorizontalSize(245),
                              margin: getMargin(
                                  left: 40, top: 84, right: 40, bottom: 5),
                              child: RichText(
                                  text: TextSpan(children: [
                                    TextSpan(
                                        text: "msg_by_signing_up_you2".tr,
                                        style: CustomTextStyles
                                            .titleSmallBluegray400SemiBold),
                                    TextSpan(
                                        text: "lbl_terms".tr,
                                        style: CustomTextStyles
                                            .titleSmallErrorContainer),
                                    TextSpan(
                                        text: "lbl_and".tr,
                                        style: CustomTextStyles
                                            .titleSmallBluegray400SemiBold),
                                    TextSpan(
                                        text: "msg_conditions_of_use".tr,
                                        style: CustomTextStyles
                                            .titleSmallErrorContainer)
                                  ]),
                                  textAlign: TextAlign.center))
                        ])))));
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapImgImage() {
    Get.back();
  }

  /// Performs a Google sign-in and returns a [GoogleUser] object.
  ///
  /// If the sign-in is successful, the [onSuccess] callback will be called with
  /// a TODO comment needed to be modified by you.
  /// If the sign-in fails, the [onError] callback will be called with the error message.
  ///

  /// Navigates to the signUpCompleteAccountScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the signUpCompleteAccountScreen.
  onTapContinuewith1() async {
    await controller.forgetPassword();
  }

  /// Navigates to the loginScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the loginScreen.
  onTapTxtLargelabelmediu() {
    Get.offNamed(
      AppRoutes.loginScreen,
    );
  }
}
