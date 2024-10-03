import 'package:url_launcher/url_launcher.dart';

import 'controller/confirmation_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';

// ignore_for_file: must_be_immutable
class ConfirmationDialog extends StatelessWidget {
  ConfirmationDialog(this.controller, {Key? key}) : super(key: key);

  ConfirmationController controller;

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return Container(
      height: mediaQueryData.size.height,
      child: Center(
        child: Container(
            width: getHorizontalSize(331),
            padding: getPadding(left: 25, top: 39, right: 25, bottom: 39),
            decoration: AppDecoration.fillWhiteA700
                .copyWith(borderRadius: BorderRadiusStyle.roundedBorder16),
            child: Column(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  GestureDetector(
                    onTap: onTapTerms,
                    child: Container(
                        width: getHorizontalSize(279),
                        margin: getMargin(top: 3),
                        child: RichText(
                            text: TextSpan(children: [
                              TextSpan(
                                  text: "lbl_i_agree_to_the".tr,
                                  style: CustomTextStyles
                                      .titleMediumBluegray400_2),
                              TextSpan(
                                  text: "msg_terms_of_service".tr,
                                  style: theme.textTheme.titleMedium),
                              TextSpan(
                                  text: "lbl_and".tr,
                                  style: CustomTextStyles
                                      .titleMediumBluegray400_2),
                              TextSpan(
                                  text: "msg_conditions_of_use".tr,
                                  style: theme.textTheme.titleMedium),
                              TextSpan(
                                  text: "msg_including_consent".tr,
                                  style:
                                      CustomTextStyles.titleMediumBluegray400_2)
                            ]),
                            textAlign: TextAlign.center)),
                  ),
                  CustomElevatedButton(
                      height: getVerticalSize(46),
                      width: getHorizontalSize(181),
                      text: "msg_agree_and_continue".tr,
                      margin: getMargin(top: 21),
                      buttonStyle: CustomButtonStyles.fillPrimaryTL20,
                      buttonTextStyle: CustomTextStyles.titleSmallGray5001,
                      onTap: () {
                        onTapAgreeand();
                      }),
                  GestureDetector(
                    onTap: onTapDisagree,
                    child: Padding(
                        padding: getPadding(top: 28),
                        child: Text("lbl_disgree".tr,
                            style: CustomTextStyles.titleSmallRedA200)),
                  )
                ])),
      ),
    );
  }

  /// Navigates to the homeContainerScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the homeContainerScreen.
  onTapAgreeand() async {
    await controller.confirmAgreement(true);

    Get.back();
  }

  onTapDisagree() async {
    await controller.confirmAgreement(false);

    Get.back();
  }

  onTapTerms() async {
    if (await canLaunch('https://tieup.net/privacy')) {
      await launch('https://tieup.net/privacy');
    } else {
      throw 'Could not launch https://tieup.net/privacy';
    }
  }
}
