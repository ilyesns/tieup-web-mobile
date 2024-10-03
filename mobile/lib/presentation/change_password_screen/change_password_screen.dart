import 'controller/change_password_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';

// ignore_for_file: must_be_immutable
class ChangePasswordScreen extends GetWidget<ChangePasswordController> {
  ChangePasswordScreen({Key? key}) : super(key: key);

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
                              child: Text("Change password".tr,
                                  style: theme.textTheme.headlineSmall)),
                          Align(
                              alignment: Alignment.centerLeft,
                              child: Padding(
                                  padding: getPadding(top: 28),
                                  child: Text("New password".tr,
                                      style:
                                          CustomTextStyles.titleSmallPrimary))),
                          CustomTextFormField(
                              autofocus: false,
                              focusNode: FocusNode(),
                              obscureText: false,
                              controller: controller.passwordController,
                              margin: getMargin(top: 9),
                              hintText: "Enter a new password".tr,
                              hintStyle:
                                  CustomTextStyles.titleMediumBluegray400,
                              textInputAction: TextInputAction.done,
                              textInputType: TextInputType.emailAddress,
                              validator: (value) {
                                if (value == null || value.length < 7) {
                                  return "Please enter valid password";
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
    await controller.changePassword();
  }

  /// Navigates to the loginScreen when the action is triggered.
}
