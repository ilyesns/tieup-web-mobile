import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/presentation/home_page/widgets/offer_item_widget.dart';
import 'package:Tieup/widgets/loading_widget.dart';

import 'controller/search_controller.dart';
import 'package:flutter/material.dart' hide SearchController;
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_search_view.dart';

class SearchScreen extends GetWidget<SearchController> {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: appTheme.whiteA70001,
        appBar: CustomAppBar(
            leadingWidth: getHorizontalSize(48),
            leading: AppbarImage(
                svgPath: ImageConstant.imgGroup162799,
                margin: getMargin(left: 24, top: 13, bottom: 13),
                onTap: () {
                  onTapArrowbackone();
                }),
            centerTitle: true,
            title: AppbarTitle(text: "Find Offers")),
        body: SingleChildScrollView(
          child: Container(
            width: double.maxFinite,
            height: mediaQueryData.size.height,
            padding: getPadding(left: 24, right: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                CustomSearchView(
                    onEditingComplete: () {
                      controller.fetchSearchingOffers();
                      controller.searchFocusNode.unfocus();
                    },
                    margin: getMargin(top: 30),
                    focusNode: controller.searchFocusNode,
                    controller: controller.searchController,
                    hintText: "lbl_search".tr,
                    hintStyle: CustomTextStyles.titleMediumBluegray400,
                    prefix: Container(
                        margin:
                            getMargin(left: 16, top: 17, right: 8, bottom: 17),
                        child:
                            CustomImageView(svgPath: ImageConstant.imgSearch)),
                    prefixConstraints:
                        BoxConstraints(maxHeight: getVerticalSize(52)),
                    suffix: Container(
                      child: IconButton(
                        onPressed: () {
                          controller.searchController.clear();
                          controller.isSearching.value = false;
                          controller.offers.value = [];
                          controller.searchFocusNode.unfocus();
                        },
                        icon: Icon(
                          Icons.clear,
                          color: Colors.grey.shade600,
                        ),
                      ),
                    ),
                    suffixConstraints:
                        BoxConstraints(maxHeight: getVerticalSize(52))),
                Obx(
                  () => controller.isSearching.isFalse
                      ? Expanded(
                          child: Container(
                            child: Center(
                              child: Text("Type for searching a offer"),
                            ),
                          ),
                        )
                      : controller.isLoading.isTrue
                          ? Expanded(
                              child: Container(
                                child: Center(child: LoadingWidget()),
                              ),
                            )
                          : controller.offers.isEmpty
                              ? Expanded(
                                  child: Container(
                                    child: Center(
                                      child: Text(
                                          'No result for this term :${controller.searchController.text}'),
                                    ),
                                  ),
                                )
                              : Expanded(
                                  child: Padding(
                                      padding: getPadding(top: 24),
                                      child: Obx(() => ListView.separated(
                                          physics: BouncingScrollPhysics(),
                                          shrinkWrap: true,
                                          separatorBuilder: (context, index) {
                                            return SizedBox(
                                                height: getVerticalSize(12));
                                          },
                                          itemCount: controller.offers.length,
                                          itemBuilder: (context, index) {
                                            Offer model =
                                                controller.offers[index];
                                            return OfferItemWidget(model);
                                          })))),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapArrowbackone() {
    Get.back();
  }

  /// Navigates to the jobDetailsTabContainerScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the jobDetailsTabContainerScreen.
  onTapView() {
    Get.toNamed(
      AppRoutes.jobDetailsTabContainerScreen,
    );
  }
}
