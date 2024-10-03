import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/data/models/service/service.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/firebase/firebase_user_provider.dart';
import 'package:Tieup/presentation/categories_screen/categories_screen.dart';
import 'package:Tieup/presentation/categories_screen/controller/categories_controller.dart';
import 'package:Tieup/presentation/home_container_screen/controller/home_container_controller.dart';
import 'package:shimmer/shimmer.dart';
import 'controller/home_controller.dart';
import 'models/home_item_model.dart';
import 'models/home_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_circleimage.dart';
import 'package:Tieup/widgets/app_bar/appbar_image_1.dart';
import 'package:Tieup/widgets/app_bar/appbar_subtitle.dart';
import 'package:Tieup/widgets/app_bar/appbar_subtitle_2.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';
import 'package:Tieup/widgets/custom_search_view.dart';
import 'dart:developer';

import 'widgets/offer_item_widget.dart';

class HomePage extends GetWidget<HomeController> {
  HomePage({Key? key})
      : super(
          key: key,
        );
  final appStateNotifer = AppStateNotifier.instance;
  final homeContainer = Get.find<HomeContainerController>();
  final categoriesContainer = Get.find<CategoriesController>();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: appTheme.whiteA70001,
        appBar: CustomAppBar(
          leadingWidth: getHorizontalSize(74),
          leading: appStateNotifer.loggedIn
              ? Obx((() => currentUser.value!.photoURL != null
                  ? AppbarCircleimage(
                      url: currentUser.value!.photoURL!,
                      margin: getMargin(
                        left: 24,
                      ),
                    )
                  : AppbarCircleimage(
                      imagePath: ImageConstant.imgAvatar,
                      margin: getMargin(
                        left: 24,
                      ),
                    )))
              : AppbarCircleimage(
                  imagePath: ImageConstant.imgAvatar,
                  margin: getMargin(
                    left: 24,
                  ),
                ),
          title: Padding(
            padding: getPadding(
              left: 10,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                if (appStateNotifer.loggedIn)
                  Obx(
                    () => AppbarSubtitle(
                      text: appStateNotifer.loggedIn
                          ? "Hi,${currentUser.value!.firstName == null ? '' : currentUser.value!.firstName.toString().capitalizeFirstLetter()} ${currentUser.value!.lastName ?? ''}"
                          : "msg_hi_welcome_back".tr,
                    ),
                  ),
                if (!appStateNotifer.loggedIn)
                  AppbarSubtitle(
                    text: "msg_hi_welcome_back".tr,
                  ),
                AppbarSubtitle2(
                  text: "msg_find_your_dream2".tr,
                  margin: getMargin(
                    top: 9,
                    right: 33,
                  ),
                ),
              ],
            ),
          ),
          actions: [
            AppbarImage1(
              svgPath: ImageConstant.imgNotification,
              margin: getMargin(
                left: 24,
                top: 13,
                right: 24,
                bottom: 13,
              ),
            ),
          ],
        ),
        body: RefreshIndicator(
          onRefresh: onRefresh,
          child: Container(
            width: mediaQueryData.size.width,
            height: mediaQueryData.size.height,
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                mainAxisSize: MainAxisSize.max,
                children: [
                  Align(
                    alignment: Alignment.center,
                    child: GestureDetector(
                      onTap: () => Get.toNamed(AppRoutes.searchScreen),
                      child: CustomSearchView(
                        enabled: false,
                        margin: getMargin(
                          left: 24,
                          top: 30,
                          right: 24,
                        ),
                        controller: controller.searchController,
                        hintText: "lbl_search".tr,
                        autofocus: false,
                        hintStyle: CustomTextStyles.titleMediumBluegray400,
                        alignment: Alignment.center,
                        prefix: Container(
                          margin: getMargin(
                            left: 16,
                            top: 17,
                            right: 8,
                            bottom: 17,
                          ),
                          child: CustomImageView(
                            svgPath: ImageConstant.imgSearch,
                          ),
                        ),
                        prefixConstraints: BoxConstraints(
                          maxHeight: getVerticalSize(52),
                        ),
                        suffix: Container(
                          margin: getMargin(
                            left: 30,
                            top: 17,
                            right: 16,
                            bottom: 17,
                          ),
                          child: CustomImageView(
                            svgPath: ImageConstant.imgFilterPrimary,
                          ),
                        ),
                        suffixConstraints: BoxConstraints(
                          maxHeight: getVerticalSize(52),
                        ),
                      ),
                    ),
                  ),
                  Padding(
                    padding: getPadding(left: 24, top: 25, bottom: 24),
                    child: Text(
                      "lbl_recommendation".tr,
                      style: CustomTextStyles.titleMedium18,
                    ),
                  ),
                  Obx((() {
                    if (controller.loading.isTrue) {
                      return Container(
                        width: MediaQuery.of(context).size.width,
                        height: getSize(120),
                        child: ListView.builder(
                          shrinkWrap: true,
                          scrollDirection: Axis.horizontal,
                          itemCount: 3, // Just one shimmer item for now
                          itemBuilder: (context, index) {
                            return Padding(
                              padding: getPadding(right: 16),
                              child: SizedBox(
                                width: MediaQuery.of(context).size.width - 30,
                                child: Shimmer.fromColors(
                                  baseColor: Colors.grey[300]!,
                                  highlightColor: Colors.grey[100]!,
                                  child: Container(
                                    height: getSize(150),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                  ),
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    }
                    if (controller.services.isEmpty) {
                      return Container(
                        child: Center(
                          child: Text('Empty list'),
                        ),
                      );
                    } else {
                      return Container(
                        width: mediaQueryData.size.width,
                        height: 150,
                        child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemBuilder: (_, index) {
                              Service service = controller.services
                                  .where((service) => service.isRoot!)
                                  .toList()[index];
                              return GestureDetector(
                                  onTap: () {
                                    homeContainer.navigateToCategories(service);
                                    categoriesContainer
                                        .onCategoryClicked(service);
                                  },
                                  child: ServiceItem(service: service));
                            },
                            shrinkWrap: true,
                            separatorBuilder: (
                              context,
                              index,
                            ) {
                              return SizedBox(
                                width: getHorizontalSize(16),
                              );
                            },
                            itemCount: controller.services
                                .where((service) => service.isRoot!)
                                .toList()
                                .length),
                      );
                    }
                  })),
                  Padding(
                    padding: getPadding(
                      left: 24,
                      top: 22,
                    ),
                    child: Text(
                      "Recent Offers",
                      style: CustomTextStyles.titleMediumInter,
                    ),
                  ),
                  Align(
                    alignment: Alignment.center,
                    child: Padding(
                      padding: getPadding(
                        left: 24,
                        top: 16,
                        right: 24,
                      ),
                      child: Obx(() {
                        if (controller.loading2.isTrue) {
                          return Container(
                            child: ListView.separated(
                              shrinkWrap: true,
                              physics: NeverScrollableScrollPhysics(),
                              itemCount: 4,
                              separatorBuilder: (
                                context,
                                index,
                              ) {
                                return SizedBox(
                                  height: getHorizontalSize(16),
                                );
                              },
                              itemBuilder: (context, index) {
                                return buildShimmerLoading();
                              },
                            ),
                          );
                        }
                        if (controller.offers.isEmpty) {
                          return Container();
                        } else {
                          return Container(
                            child: ListView.separated(
                              shrinkWrap: true,
                              physics: NeverScrollableScrollPhysics(),
                              itemCount: controller.offers.length,
                              separatorBuilder: (
                                context,
                                index,
                              ) {
                                return SizedBox(
                                  height: getHorizontalSize(16),
                                );
                              },
                              itemBuilder: (context, index) {
                                Offer offer = controller.offers[index];
                                return OfferItemWidget(offer);
                              },
                            ),
                          );
                        }
                      }),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Future<void> onRefresh() async {
    Future.wait([controller.fetchServices(), controller.fetchOffers()]);
  }
}

class ServiceItem extends StatelessWidget {
  const ServiceItem({
    Key? key,
    required this.service,
  }) : super(key: key);

  final Service service;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: mediaQueryData.size.width - getSize(60),
      padding: getPadding(
        all: 16,
      ),
      decoration: AppDecoration.fillPrimary.copyWith(
        borderRadius: BorderRadiusStyle.roundedBorder16,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: getSize(48),
            width: getSize(48),
            padding: getPadding(
              all: 8,
            ),
            decoration: IconButtonStyleHelper.fillOnPrimaryContainer,
            child: CustomImageView(
              url: service.image,
            ),
          ),
          Padding(
            padding: getPadding(
              left: 12,
              top: 4,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  service.name!,
                  style: CustomTextStyles.titleSmallGray5001Bold,
                ),
                Opacity(
                  opacity: 0.8,
                  child: Padding(
                    padding: getPadding(
                      top: 7,
                    ),
                    child: Container(
                      width: MediaQuery.of(context).size.width -
                          getSize(129) -
                          20 -
                          12, // Adjust width here
                      child: Text(
                        service.description!,
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: CustomTextStyles.labelLargeGray5001SemiBold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
