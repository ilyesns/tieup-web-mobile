import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/offer_screen/controller/offer_controller.dart';
import 'package:Tieup/widgets/custom_outlined_button.dart';
import 'package:url_launcher/url_launcher.dart';

class PlanWidget extends StatelessWidget {
  final Plan plan;
  final Offer offer;
  PlanWidget({
    Key? key,
    required this.plan,
    required this.offer,
  }) : super(key: key);
  final appStateNotifer = AppStateNotifier.instance;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(10),
      child: Container(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              plan.title ?? '',
              style: CustomTextStyles.titleMediumInter,
            ),
            SizedBox(height: 8),
            Text(
              plan.description ?? '',
              style: TextStyle(
                fontSize: 14,
              ),
            ),
            SizedBox(height: 8),
            Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Revision Number:',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
                Text(
                  '${plan.revisionNumber ?? 0}',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ],
            ),
            SizedBox(height: 8),
            Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Delivery Time:',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
                Text(
                  '${plan.deliveryTime ?? 0}',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: CustomOutlinedButton(
                onTap: () => {onTapContinue(plan)},
                text: 'Continue ${plan.price!.ceil()}DT',
                buttonTextStyle:
                    TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            )
          ],
        ),
      ),
    );
  }

  onTapContinue(Plan plan) async {
    try {
      if (appStateNotifer.loggedIn) {
        ProgressDialogUtils.showProgressDialog();

        var result = await ApiClient()
            .calculOrderTotal(plan.price!, currentJwtToken.value!);
        ProgressDialogUtils.hideProgressDialog();
        Get.bottomSheet(
          Container(
            width: mediaQueryData.size.width,
            height: mediaQueryData.size.height,
            child: Column(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  decoration: AppDecoration.fillWhiteA700.copyWith(
                      borderRadius: BorderRadius.only(
                          topLeft: Radius.circular(20),
                          topRight: Radius.circular(20))),
                  width: mediaQueryData.size.width,
                  height: 400,
                  padding: getPadding(top: 10, left: 10, right: 10, bottom: 10),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Order Details",
                            style: CustomTextStyles.titleMedium18,
                          ),
                        ],
                      ),
                      Divider(),
                      Padding(
                        padding: getPadding(top: 20),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${plan.title!.toUpperCase()}',
                              style: CustomTextStyles.titleMedium15,
                            ),
                            CustomImageView(
                              svgPath: ImageConstant.imgCheckmarkPrimary,
                              width: 22,
                              height: 22,
                            )
                          ],
                        ),
                      ),
                      Padding(
                        padding: getPadding(top: 10, bottom: 5),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${plan.deliveryTime!.toUpperCase()}',
                              style: CustomTextStyles.titleMedium15,
                            ),
                            CustomImageView(
                              svgPath: ImageConstant.imgCheckmarkPrimary,
                              width: 22,
                              height: 22,
                            )
                          ],
                        ),
                      ),
                      Padding(
                        padding: getPadding(top: 10, bottom: 5),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${plan.revisionNumber!} REVISIONS',
                              style: CustomTextStyles.titleMedium15,
                            ),
                            CustomImageView(
                              svgPath: ImageConstant.imgCheckmarkPrimary,
                              width: 22,
                              height: 22,
                            )
                          ],
                        ),
                      ),
                      Padding(
                        padding: getPadding(
                          right: 10,
                          top: 10,
                        ),
                        child: Divider(),
                      ),
                      Padding(
                        padding: getPadding(top: 10, bottom: 5),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'SERVICE FEE',
                              style: CustomTextStyles.titleMedium15,
                            ),
                            Text(
                              '${(result['serviceFee']).ceil()} DT',
                              style: CustomTextStyles.titleMedium15,
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: getPadding(
                          right: 10,
                          top: 10,
                        ),
                        child: Divider(),
                      ),
                      Padding(
                        padding: getPadding(top: 10, bottom: 5),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'TOTAL',
                              style: CustomTextStyles.titleMedium15,
                            ),
                            Text(
                              '${(result['total']).ceil()} DT',
                              style: CustomTextStyles.titleMedium15,
                            ),
                          ],
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        child: CustomOutlinedButton(
                          onTap: () => {onTapConfirm(plan, result)},
                          text: 'Confirm ${result['total']} DT',
                          buttonTextStyle: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      } else {
        Get.rawSnackbar(
            messageText: Text(
              'Please login to make this order',
              style: TextStyle(color: Colors.white),
            ),
            backgroundColor: Colors.black);
      }
    } catch (e) {
      print(e);
      ProgressDialogUtils.hideProgressDialog();
      Get.rawSnackbar(message: 'Something went wrong!');
    }
    ProgressDialogUtils.hideProgressDialog();
  }

  onTapConfirm(Plan planData, service) async {
    try {
      ProgressDialogUtils.showProgressDialog();
      final orderData = {
        'offerId': offer.offerId,
        'freelancerId': offer.freelancerId,
        'clientId': currentUser.value!.userId,
        'total': service['total'],
        'base': planData.price,
        'serviceFee': service['serviceFee'],
        'expiration': planData.deliveryTime,
        'description': offer.title,
        'plan': planData.planType,
      };

      var result =
          await ApiClient().placeOrder(orderData, currentJwtToken.value!);
      ProgressDialogUtils.hideProgressDialog();

      // Extract the payment URL from the result
      final paymentUrl = result['payUrl'];

      if (await canLaunch(paymentUrl)) {
        await launch(paymentUrl);
      } else {
        throw 'Could not launch $paymentUrl';
      }
    } catch (e) {
      ProgressDialogUtils.hideProgressDialog();

      print(e);
      Get.rawSnackbar(message: 'Something went wrong!');
    }
  }
}
