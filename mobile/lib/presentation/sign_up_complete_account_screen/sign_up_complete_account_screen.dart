import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/firebase_auth.dart';

import 'controller/sign_up_complete_account_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';
import 'package:Tieup/data/models/registerDeviceAuth/post_register_device_auth_req.dart';
import 'package:Tieup/data/models/registerDeviceAuth/post_register_device_auth_resp.dart';
import 'package:Tieup/core/constants/user.dart';
import 'package:Tieup/core/constants/role.dart';
import 'package:fluttertoast/fluttertoast.dart';

// ignore_for_file: must_be_immutable
class SignUpCompleteAccountScreen
    extends GetWidget<SignUpCompleteAccountController> {
  SignUpCompleteAccountScreen({Key? key}) : super(key: key);

  GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            backgroundColor: appTheme.whiteA70001,
            body: Container(
                width: mediaQueryData.size.width,
                height: mediaQueryData.size.height,
                padding: getPadding(left: 24, top: 13, right: 24, bottom: 13),
                child: Form(
                  key: _formKey,
                  child: SingleChildScrollView(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        mainAxisSize: MainAxisSize.max,
                        children: [
                          CustomImageView(
                              svgPath: ImageConstant.imgGroup162799,
                              height: getSize(24),
                              width: getSize(24),
                              onTap: () {
                                onTapImgImage();
                              }),
                          Align(
                              alignment: Alignment.centerRight,
                              child: Padding(
                                  padding: getPadding(top: 47, right: 15),
                                  child: Text("msg_complete_your_account".tr,
                                      style: theme.textTheme.headlineSmall))),
                          Padding(
                              padding: getPadding(top: 33),
                              child: Text("lbl_first_name".tr,
                                  style: theme.textTheme.titleSmall)),
                          CustomTextFormField(
                            focusNode: controller.firstNameFocusNode,
                            controller: controller.firstNameController,
                            margin: getMargin(top: 9),
                            hintText: "msg_enter_your_first".tr,
                            hintStyle: CustomTextStyles.titleMediumBluegray400,
                            validator: (value) {
                              if (!isText(value, isRequired: true)) {
                                return "Please enter valid text";
                              }
                              return null;
                            },
                            contentPadding: getPadding(
                                left: 12, top: 15, right: 12, bottom: 15),
                          ),
                          Padding(
                              padding: getPadding(top: 18),
                              child: Text("lbl_last_name".tr,
                                  style: theme.textTheme.titleSmall)),
                          CustomTextFormField(
                            focusNode: controller.lastNameFocusNode,
                            controller: controller.lastNameController,
                            margin: getMargin(top: 9),
                            hintText: "msg_enter_your_last".tr,
                            hintStyle: CustomTextStyles.titleMediumBluegray400,
                            validator: (value) {
                              if (!isText(value, isRequired: true)) {
                                return "Please enter valid text";
                              }
                              return null;
                            },
                            contentPadding: getPadding(
                                left: 12, top: 15, right: 12, bottom: 15),
                          ),
                          Padding(
                              padding: getPadding(top: 18),
                              child: Text("Phone Number",
                                  style: theme.textTheme.titleSmall)),
                          CustomTextFormField(
                            focusNode: controller.phoneNumberFocusNode,
                            textInputType:
                                TextInputType.numberWithOptions(decimal: false),
                            controller: controller.phoneNumberController,
                            margin: getMargin(top: 9),
                            hintText: "Enter your phone number".tr,
                            hintStyle: CustomTextStyles.titleMediumBluegray400,
                            validator: (value) {
                              if (value == null) {
                                return "Please enter valid number";
                              }
                              return null;
                            },
                            contentPadding: getPadding(
                                left: 12, top: 15, right: 12, bottom: 15),
                          ),
                          Padding(
                              padding: getPadding(top: 18),
                              child: Text("lbl_password".tr,
                                  style: theme.textTheme.titleSmall)),
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
                                if (value == null ||
                                    (!isValidPassword(value,
                                        isRequired: true))) {
                                  return "Please enter valid password";
                                }

                                return null;
                              },
                              obscureText: controller.isShowPassword.value,
                              contentPadding:
                                  getPadding(left: 16, top: 15, bottom: 15))),
                          Obx(() => CustomTextFormField(
                              focusNode: controller.confirmPasswordFocusNode,
                              controller: controller.confirmPasswordController,
                              margin: getMargin(top: 9),
                              hintText: "Confirm password",
                              hintStyle:
                                  CustomTextStyles.titleMediumBluegray400,
                              textInputAction: TextInputAction.done,
                              textInputType: TextInputType.visiblePassword,
                              suffix: InkWell(
                                  onTap: () {
                                    controller.isShowConfirmPassword.value =
                                        !controller.isShowConfirmPassword.value;
                                  },
                                  child: Container(
                                      margin: getMargin(
                                          left: 30,
                                          top: 14,
                                          right: 16,
                                          bottom: 14),
                                      child: CustomImageView(
                                          svgPath: controller
                                                  .isShowConfirmPassword.value
                                              ? ImageConstant.imgCheckmark
                                              : ImageConstant.imgCheckmark))),
                              suffixConstraints: BoxConstraints(
                                  maxHeight: getVerticalSize(52)),
                              validator: (value) {
                                if (value == null ||
                                    (!isValidPassword(value,
                                        isRequired: true))) {
                                  return "Please enter valid password";
                                }
                                if (value !=
                                    controller.passwordController.text) {
                                  return "Password  doesn't match.";
                                }
                                return null;
                              },
                              obscureText:
                                  controller.isShowConfirmPassword.value,
                              contentPadding:
                                  getPadding(left: 16, top: 15, bottom: 15))),
                          CustomElevatedButton(
                              text: "msg_continue_with_email".tr,
                              margin: getMargin(top: 40),
                              buttonStyle: CustomButtonStyles.fillPrimary,
                              onTap: () {
                                onTapContinuewith();
                              }),
                          Align(
                              alignment: Alignment.center,
                              child: Padding(
                                  padding:
                                      getPadding(left: 40, top: 28, right: 40),
                                  child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
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
                                                    style: theme.textTheme
                                                        .titleMedium)))
                                      ]))),
                          Align(
                              alignment: Alignment.center,
                              child: Container(
                                  width: getHorizontalSize(245),
                                  margin: getMargin(
                                      left: 40, top: 19, right: 40, bottom: 5),
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
                                      textAlign: TextAlign.center)))
                        ]),
                  ),
                ))));
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapImgImage() {
    Get.back();
  }

  /// validates the form input fields and executes the API if all the fields are valid
  /// If the call fails, the function calls the `_onOnTapSignUpError()` function.
  ///
  /// Throws a `NoInternetException` if there is no internet connection.
  Future<void> onTapContinuewith() async {
    if (_formKey.currentState!.validate()) {
      try {
        var user = await AuthManager.emailCreateAccountFunc(
            Get.arguments['email'], controller.passwordController.text);
        var userData = {
          'firstName': controller.firstNameController.text,
          'lastName': controller.lastNameController.text,
          'phoneNumber': controller.phoneNumberController.text,
          'email': Get.arguments['email'],
          'userId': user!.user!.uid
        };

        var res = await ApiClient().createUser(userData);
        _onOnTapSignUpSuccess();
      } on NoInternetException catch (e) {
        Get.rawSnackbar(message: e.toString());
      } catch (e) {
        //TODO: Handle generic errors
      }
    }
  }

  /// Navigates to the jobTypeScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the jobTypeScreen.
  void _onOnTapSignUpSuccess() {
    Get.offAllNamed(AppRoutes.homeContainerScreen);
  }

  /// Displays a toast message using the Fluttertoast library.
  void _onOnTapSignUpError() {
    Fluttertoast.showToast(
        msg: controller.postRegisterDeviceAuthResp.message.toString() ?? '');
  }

  /// Navigates to the loginScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the loginScreen.
  onTapTxtLargelabelmediu() {
    Get.toNamed(
      AppRoutes.loginScreen,
    );
  }
}
