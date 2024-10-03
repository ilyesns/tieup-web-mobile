import 'package:firebase_auth/firebase_auth.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/firebase_auth.dart';
import 'package:url_launcher/url_launcher.dart';

import 'controller/login_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_outlined_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';
import 'package:Tieup/domain/googleauth/google_auth_helper.dart';

// ignore_for_file: must_be_immutable
class LoginScreen extends GetWidget<LoginController> {
  LoginScreen({Key? key}) : super(key: key);
  final auth = AuthManager();
  GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            resizeToAvoidBottomInset: false,
            backgroundColor: appTheme.whiteA70001,
            body: Form(
                key: _formKey,
                child: Container(
                    width: mediaQueryData.size.width,
                    height: mediaQueryData.size.height,
                    padding:
                        getPadding(left: 24, top: 13, right: 24, bottom: 13),
                    child: SingleChildScrollView(
                      child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            CustomImageView(
                                svgPath: ImageConstant.imgGroup162799,
                                height: getSize(24),
                                width: getSize(24),
                                alignment: Alignment.centerLeft,
                                onTap: () {
                                  onTapImgImage();
                                }),
                            Padding(
                                padding: getPadding(top: 44),
                                child: Text("msg_hi_welcome_back".tr,
                                    style: theme.textTheme.headlineSmall)),
                            CustomOutlinedButton(
                                height: getVerticalSize(56),
                                text: "msg_continue_with_google".tr,
                                margin: getMargin(top: 31),
                                leftIcon: Container(
                                    margin: getMargin(right: 12),
                                    child: CustomImageView(
                                        svgPath:
                                            ImageConstant.imgGooglesymbol1)),
                                buttonStyle: CustomButtonStyles.outlinePrimary,
                                buttonTextStyle: theme.textTheme.titleMedium!,
                                onTap: () {
                                  onTapContinuewith();
                                }),
                            CustomOutlinedButton(
                                height: getVerticalSize(56),
                                text: "Continue with LinkedIn",
                                margin: getMargin(top: 16),
                                leftIcon: Container(
                                    margin: getMargin(right: 12),
                                    child: CustomImageView(
                                        svgPath: ImageConstant.imgLinkedIn)),
                                buttonStyle: CustomButtonStyles.outlinePrimary,
                                buttonTextStyle: theme.textTheme.titleMedium!),
                            Padding(
                                padding:
                                    getPadding(left: 33, top: 26, right: 33),
                                child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Padding(
                                          padding:
                                              getPadding(top: 8, bottom: 8),
                                          child: SizedBox(
                                              width: getHorizontalSize(62),
                                              child: Divider())),
                                      Padding(
                                          padding: getPadding(left: 12),
                                          child: Text("msg_or_continue_with".tr,
                                              style: CustomTextStyles
                                                  .titleSmallBluegray300)),
                                      Padding(
                                          padding:
                                              getPadding(top: 8, bottom: 8),
                                          child: SizedBox(
                                              width: getHorizontalSize(74),
                                              child: Divider(
                                                  indent:
                                                      getHorizontalSize(12))))
                                    ])),
                            Align(
                                alignment: Alignment.centerLeft,
                                child: Padding(
                                    padding: getPadding(top: 28),
                                    child: Text("lbl_email".tr,
                                        style: theme.textTheme.titleSmall))),
                            CustomTextFormField(
                                controller: controller.emailController,
                                focusNode: controller.emailFocusNode,
                                margin: getMargin(top: 9),
                                hintText: "msg_enter_your_email".tr,
                                hintStyle:
                                    CustomTextStyles.titleMediumBluegray400,
                                textInputAction: TextInputAction.done,
                                textInputType: TextInputType.emailAddress,
                                validator: (value) {
                                  if (value == null ||
                                      (!isValidEmail(value,
                                          isRequired: true))) {
                                    return "Please enter valid email";
                                  }
                                  return null;
                                },
                                contentPadding: getPadding(
                                    left: 12, top: 15, right: 12, bottom: 15)),
                            Align(
                                alignment: Alignment.centerLeft,
                                child: Padding(
                                    padding: getPadding(top: 28),
                                    child: Text("Password",
                                        style: theme.textTheme.titleSmall))),
                            Obx(() => CustomTextFormField(
                                focusNode: controller.passwordFocusNode,
                                controller: controller.passwordController,
                                margin: getMargin(top: 9),
                                hintText: "msg_create_a_password".tr,
                                hintStyle:
                                    CustomTextStyles.titleMediumBluegray400,
                                textInputAction: TextInputAction.done,
                                textInputType: TextInputType.visiblePassword,
                                suffix: InkWell(
                                    onTap: () {
                                      controller.isShowPassword.value =
                                          !controller.isShowPassword.value;
                                    },
                                    child: Container(
                                        margin: getMargin(
                                            left: 30,
                                            top: 14,
                                            right: 16,
                                            bottom: 14),
                                        child: CustomImageView(
                                            svgPath: controller
                                                    .isShowPassword.value
                                                ? ImageConstant.imgCheckmark
                                                : ImageConstant.imgCheckmark))),
                                suffixConstraints: BoxConstraints(
                                    maxHeight: getVerticalSize(52)),
                                validator: (value) {
                                  if (value == null) {
                                    return "Please enter your password";
                                  }

                                  return null;
                                },
                                obscureText: controller.isShowPassword.value,
                                contentPadding:
                                    getPadding(left: 16, top: 15, bottom: 15))),
                            CustomElevatedButton(
                                text: "msg_continue_with_email".tr,
                                margin: getMargin(top: 40),
                                buttonStyle: CustomButtonStyles.fillPrimary,
                                onTap: () async {
                                  onTapContinuewith1();
                                }),
                            Padding(
                                padding:
                                    getPadding(left: 41, top: 26, right: 41),
                                child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Padding(
                                          padding: getPadding(bottom: 1),
                                          child: Text(
                                              "msg_don_t_have_an_account".tr,
                                              style: CustomTextStyles
                                                  .titleMediumBluegray300)),
                                      GestureDetector(
                                          onTap: () {
                                            onTapTxtLargelabelmediu();
                                          },
                                          child: Padding(
                                              padding: getPadding(left: 2),
                                              child: Text("lbl_sign_up".tr,
                                                  style: theme
                                                      .textTheme.titleMedium)))
                                    ])),
                            GestureDetector(
                              onTap: () {
                                Get.toNamed(AppRoutes.forgetPasswordScreen);
                              },
                              child: Padding(
                                  padding:
                                      getPadding(left: 41, top: 26, right: 41),
                                  child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Padding(
                                            padding: getPadding(bottom: 1),
                                            child: Text("Forget password?".tr,
                                                style: CustomTextStyles
                                                    .titleMediumBluegray300)),
                                      ])),
                            ),
                            GestureDetector(
                              onTap: onTapTerms,
                              child: Container(
                                  width: getHorizontalSize(245),
                                  margin: getMargin(
                                      left: 40, top: 50, right: 40, bottom: 5),
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
                                      textAlign: TextAlign.center)),
                            )
                          ]),
                    )))));
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapImgImage() {
    Get.back();
  }

  onTapContinuewith() async {
    try {
      final userCredential = await AuthManager().googleSignInFunc();
      final userData = {
        'userId': userCredential!.user!.uid,
        'email': userCredential.user!.email ?? '',
        'phoneNumber': userCredential.user!.phoneNumber ?? '',
        'photoURL': userCredential.user!.photoURL,
        'firstName':
            splitFullName(userCredential.user!.displayName ?? '')['firstName'],
        'lastName':
            splitFullName(userCredential.user!.displayName ?? '')['lastName']
      };
      final result = await ApiClient().mayBeCreateUser(userData);
      Get.offAllNamed(AppRoutes.homeContainerScreen);
    } catch (e) {
      print(e);

      Get.snackbar('Error', "Something went wrong !");
    }
  }

  /// Navigates to the enterOtpScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the enterOtpScreen.
  onTapContinuewith1() async {
    ProgressDialogUtils.showProgressDialog();

    try {
      await ApiClient().isNetworkConnected();

      UserCredential? user = await auth.signInWithCredentials(
          controller.emailController.text, controller.passwordController.text);
      ProgressDialogUtils.hideProgressDialog();

      Get.offNamed(
        AppRoutes.homeContainerScreen,
      );
    } on NoInternetException catch (e) {
      ProgressDialogUtils.hideProgressDialog();

      Get.rawSnackbar(message: e.toString());
    } catch (e) {
      ProgressDialogUtils.hideProgressDialog();
      Get.rawSnackbar(message: e.toString());
    }
  }

  onTapTerms() async {
    if (await canLaunch('https://tieup.net/privacy')) {
      await launch('https://tieup.net/privacy');
    } else {
      throw 'Could not launch https://tieup.net/privacy';
    }
  }

  /// Navigates to the signUpCreateAcountScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the signUpCreateAcountScreen.
  onTapTxtLargelabelmediu() {
    Get.toNamed(
      AppRoutes.signUpCreateAcountScreen,
    );
  }
}
