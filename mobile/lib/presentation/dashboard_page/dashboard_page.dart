import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/data/models/service/service.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/firebase/firebase_user_provider.dart';
import 'package:Tieup/presentation/categories_screen/controller/categories_controller.dart';
import 'package:Tieup/presentation/home_container_screen/controller/home_container_controller.dart';

import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_circleimage.dart';
import 'package:Tieup/widgets/app_bar/appbar_image_1.dart';
import 'package:Tieup/widgets/app_bar/appbar_subtitle.dart';
import 'package:Tieup/widgets/app_bar/appbar_subtitle_2.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';
import 'package:Tieup/widgets/custom_search_view.dart';

import 'controller/dashboard_controller.dart';

class DashboardPage extends GetWidget<DashboardController> {
  DashboardPage({Key? key})
      : super(
          key: key,
        );
  @override
  Widget build(BuildContext context) {
    final appStateNotifer = AppStateNotifier.instance;
    DateTime now = DateTime.now();

    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: appTheme.gray100,
        body: RefreshIndicator(
          onRefresh: onRefresh,
          child: SingleChildScrollView(
            child: Container(
              width: mediaQueryData.size.width,
              height: mediaQueryData.size.height,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Container(
                    // Example fixed height

                    decoration: BoxDecoration(color: Colors.white),
                    child: Padding(
                      padding:
                          EdgeInsets.symmetric(horizontal: 15, vertical: 15),
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Hi ${currentUser.value!.firstName.toString().capitalizeFirstLetter()} ,",
                                style: TextStyle(
                                    color: Colors.black, fontSize: 15),
                              ),
                              Text(
                                "Welcome back",
                                style: CustomTextStyles.titleMedium15,
                              ),
                            ],
                          ),
                          Obx((() => currentUser.value!.photoURL != null
                              ? CustomImageView(
                                  fit: BoxFit.cover,
                                  url: currentUser.value!.photoURL ?? '',
                                  height: getSize(50),
                                  width: getSize(50),
                                  radius: BorderRadius.circular(
                                    getHorizontalSize(50),
                                  ),
                                )
                              : AppbarCircleimage(
                                  imagePath: ImageConstant.imgAvatar,
                                  margin: getMargin(
                                    left: 24,
                                  ),
                                )))
                        ],
                      ),
                    ),
                  ),
                  Obx(
                    () => controller.isLoading.isTrue
                        ? Container()
                        : Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                margin: getMargin(top: 20, left: 15, right: 15),
                                decoration: AppDecoration.fillWhiteA700
                                    .copyWith(
                                        color: Colors.white,
                                        border:
                                            Border.all(color: appTheme.gray100),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.grey.withOpacity(
                                                0.5), // Shadow color
                                            spreadRadius: 2, // Spread radius
                                            blurRadius: 5, // Blur radius
                                            offset: Offset(0,
                                                3), // Offset in the y-direction
                                          ),
                                        ],
                                        borderRadius: BorderRadius.circular(5)),
                                child: Column(children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Container(
                                          padding: EdgeInsets.all(8),
                                          decoration: BoxDecoration(
                                            border: Border(
                                              right: BorderSide(
                                                  color: Colors
                                                      .grey), // Define only the left border
                                            ),
                                          ),
                                          child: Column(
                                              mainAxisSize: MainAxisSize.max,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  'My level',
                                                  style: CustomTextStyles
                                                      .bodyMedium,
                                                ),
                                                SizedBox(
                                                  height: getSize(10),
                                                ),
                                                Text(
                                                  controller.profile.value!
                                                      .sellerLevel!
                                                      .toString()
                                                      .capitalizeFirstLetter(),
                                                  style:
                                                      theme.textTheme.bodySmall,
                                                )
                                              ]),
                                        ),
                                      ),
                                      Expanded(
                                        child: Container(
                                          padding: EdgeInsets.all(8),
                                          decoration: BoxDecoration(),
                                          child: Column(
                                              mainAxisSize: MainAxisSize.max,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  'Order Completion Rate',
                                                  style: CustomTextStyles
                                                      .bodyMedium,
                                                ),
                                                SizedBox(
                                                  height: getSize(10),
                                                ),
                                                Text(
                                                  '0',
                                                  style:
                                                      theme.textTheme.bodySmall,
                                                )
                                              ]),
                                        ),
                                      ),
                                    ],
                                  ),
                                  Divider(
                                    color: Colors.grey,
                                  ),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Container(
                                          padding: EdgeInsets.all(8),
                                          decoration: BoxDecoration(
                                            border: Border(
                                              right: BorderSide(
                                                  color: Colors
                                                      .grey), // Define only the left border
                                            ),
                                          ),
                                          child: Column(
                                              mainAxisSize: MainAxisSize.max,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  'Rating',
                                                  style: CustomTextStyles
                                                      .bodyMedium,
                                                ),
                                                SizedBox(
                                                  height: getSize(10),
                                                ),
                                                Text(
                                                  '0',
                                                  style:
                                                      theme.textTheme.bodySmall,
                                                )
                                              ]),
                                        ),
                                      ),
                                      Expanded(
                                        child: Container(
                                          padding: EdgeInsets.all(8),
                                          decoration: BoxDecoration(),
                                          child: Column(
                                              mainAxisSize: MainAxisSize.max,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  'Response time',
                                                  style: CustomTextStyles
                                                      .bodyMedium,
                                                ),
                                                SizedBox(
                                                  height: getSize(10),
                                                ),
                                                Text(
                                                  '0',
                                                  style:
                                                      theme.textTheme.bodySmall,
                                                )
                                              ]),
                                        ),
                                      ),
                                    ],
                                  )
                                ]),
                              ),
                            ],
                          ),
                  ),
                  Obx(() => controller.isLoading2.isTrue
                      ? Container()
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Padding(
                              padding: getPadding(
                                  top: 70, bottom: 15, right: 15, left: 15),
                              child: Text(
                                'Earnings',
                                style: CustomTextStyles.titleMedium15,
                              ),
                            ),
                            Container(
                              margin: getMargin(left: 15, right: 15),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 15, vertical: 15),
                              decoration: AppDecoration.fillWhiteA700.copyWith(
                                  color: Colors.white,
                                  border: Border.all(color: appTheme.gray100),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.grey
                                          .withOpacity(0.5), // Shadow color
                                      spreadRadius: 2, // Spread radius
                                      blurRadius: 5, // Blur radius
                                      offset: Offset(
                                          0, 3), // Offset in the y-direction
                                    ),
                                  ],
                                  borderRadius: BorderRadius.circular(5)),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Balance',
                                    style: CustomTextStyles.bodyMedium,
                                  ),
                                  Text(
                                    controller.wallet.value!.balance.toString(),
                                    style: CustomTextStyles.bodyMedium,
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              margin: getMargin(left: 15, top: 15, right: 15),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 15, vertical: 15),
                              decoration: AppDecoration.fillWhiteA700.copyWith(
                                  color: Colors.white,
                                  border: Border.all(color: appTheme.gray100),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.grey
                                          .withOpacity(0.5), // Shadow color
                                      spreadRadius: 2, // Spread radius
                                      blurRadius: 5, // Blur radius
                                      offset: Offset(
                                          0, 3), // Offset in the y-direction
                                    ),
                                  ],
                                  borderRadius: BorderRadius.circular(5)),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Earnings in ${getMonthName(now.month)}',
                                    style: CustomTextStyles.bodyMedium,
                                  ),
                                  Text(
                                    controller.wallet.value!.earningsInMonth
                                        .toString(),
                                    style: CustomTextStyles.bodyMedium,
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              margin: getMargin(left: 15, top: 15, right: 15),
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 15, vertical: 15),
                              decoration: AppDecoration.fillWhiteA700.copyWith(
                                  color: Colors.white,
                                  border: Border.all(color: appTheme.gray100),
                                  boxShadow: [
                                    BoxShadow(
                                      color: Colors.grey
                                          .withOpacity(0.5), // Shadow color
                                      spreadRadius: 2, // Spread radius
                                      blurRadius: 5, // Blur radius
                                      offset: Offset(
                                          0, 3), // Offset in the y-direction
                                    ),
                                  ],
                                  borderRadius: BorderRadius.circular(5)),
                              child: Row(
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    'Pending Clearance',
                                    style: CustomTextStyles.bodyMedium,
                                  ),
                                  Text(
                                    '${controller.wallet.value!.pendingClearance ?? '0'}',
                                    style: CustomTextStyles.bodyMedium,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ))
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> onRefresh() async {
    await Future.wait([
      controller.fetchFreelancerProfileS(),
      controller.fetchFreelancerWallet()
    ]);
  }
}
