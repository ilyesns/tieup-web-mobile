import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/firebase/firebase_auth.dart';

import 'controller/logout_popup_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_outlined_button.dart';

// ignore_for_file: must_be_immutable
class LogoutPopupDialog extends StatelessWidget {
  LogoutPopupDialog(this.controller, {Key? key}) : super(key: key);

  LogoutPopupController controller;
  final authManager = AuthManager();
  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SingleChildScrollView(
      child: Container(
        width: mediaQueryData.size.width,
        margin: getMargin(left: 34, right: 34, bottom: 241),
        padding: getPadding(all: 32),
        decoration: AppDecoration.fillOnPrimaryContainer
            .copyWith(borderRadius: BorderRadiusStyle.roundedBorder16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            CustomImageView(
                svgPath: ImageConstant.imgQuestion,
                height: getSize(82),
                width: getSize(82),
                margin: getMargin(top: 9)),
            Padding(
                padding: getPadding(top: 35),
                child: Text("lbl_are_you_sure".tr,
                    style: CustomTextStyles.titleMediumBold)),
            Container(
              width: getHorizontalSize(229),
              margin: getMargin(left: 6, top: 8, right: 5),
              child: Text(
                "msg_ullamcorper_imperdiet".tr,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: CustomTextStyles.titleSmallBluegray400
                    .copyWith(height: 1.57),
              ),
            ),
            Padding(
              padding: getPadding(top: 25),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: CustomOutlinedButton(
                        height: getVerticalSize(46),
                        text: "lbl_log_out2".tr,
                        margin: getMargin(right: 6),
                        buttonStyle: CustomButtonStyles.outlinePrimaryTL20,
                        buttonTextStyle:
                            CustomTextStyles.titleSmallPrimarySemiBold,
                        onTap: () {
                          onTapLogout();
                        }),
                  ),
                  Expanded(
                    child: CustomElevatedButton(
                      height: getVerticalSize(46),
                      text: "lbl_cancel".tr,
                      margin: getMargin(left: 6),
                      buttonStyle: CustomButtonStyles.fillPrimaryTL20,
                      buttonTextStyle: CustomTextStyles.titleSmallGray5001,
                      onTap: () {
                        onTapCancel();
                      },
                    ),
                  )
                ],
              ),
            )
          ],
        ),
      ),
    );
  }

  /// Navigates to the signUpCreateAcountScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the signUpCreateAcountScreen.
  onTapLogout() async {
    await authManager.signOut();
    Get.offAllNamed(
      AppRoutes.loginScreen,
    )!
        .then((value) => {
              currentUser.value = null,
            });
  }

  /// Navigates to the settingsScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the settingsScreen.
  onTapCancel() {
    Get.back();
  }
}
