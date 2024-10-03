import '../controller/onboarding_two_controller.dart';
import '../models/sliderbetterfut_item_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';

// ignore: must_be_immutable
class SliderbetterfutItemWidget extends StatelessWidget {
  SliderbetterfutItemWidget(
    this.sliderbetterfutItemModelObj, {
    Key? key,
    this.onTapLabel,
  }) : super(
          key: key,
        );

  SliderbetterfutItemModel sliderbetterfutItemModelObj;

  var controller = Get.find<OnboardingTwoController>();

  VoidCallback? onTapLabel;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.center,
      child: Container(
        padding: getPadding(
          left: 24,
          top: 32,
          right: 24,
          bottom: 32,
        ),
        decoration: AppDecoration.fillOnPrimaryContainer.copyWith(
          borderRadius: BorderRadiusStyle.roundedBorder32,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: getHorizontalSize(273),
              margin: getMargin(
                left: 6,
              ),
              child: RichText(
                text: TextSpan(
                  children: [
                    TextSpan(
                      text: "Efficient Collaboration",
                      style: theme.textTheme.headlineSmall,
                    ),
                  ],
                ),
                textAlign: TextAlign.center,
              ),
            ),
            Padding(
              padding: getPadding(
                left: 17,
                top: 14,
                right: 17,
              ),
              child: Text(
                "TieUp: Seamless collaboration. Focus on work, we handle logistics.",
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: CustomTextStyles.titleSmallBluegray300.copyWith(
                  height: 1.57,
                ),
              ),
            ),
            CustomElevatedButton(
              width: getHorizontalSize(101),
              text: "lbl_next".tr,
              margin: getMargin(
                top: 69,
              ),
              buttonStyle: CustomButtonStyles.fillPrimary,
              onTap: () {
                onTapLabel?.call();
              },
            ),
          ],
        ),
      ),
    );
  }
}
