import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:get/get.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/data/models/service/service.dart';
import 'package:Tieup/presentation/categories_screen/controller/categories_controller.dart';
import 'package:Tieup/presentation/home_container_screen/controller/home_container_controller.dart';
import 'package:Tieup/presentation/home_page/widgets/offer_item_widget.dart';
import 'package:Tieup/widgets/app_bar/appbar_image_1.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';

class CategoriesScreen extends GetWidget<CategoriesController> {
  final HomeContainerController homeContainerController =
      Get.find<HomeContainerController>();
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: appTheme.whiteA70001,
        appBar: CustomAppBar(
          leadingWidth: getHorizontalSize(74),
          title: Padding(
            padding: getPadding(left: 10, top: 10, bottom: 10),
            child: Obx(() => homeContainerController.isOpenSidebarCat.isFalse
                ? Text(
                    "Categories",
                    style: CustomTextStyles.titleMediumMedium,
                  )
                : InkWell(
                    onTap: () => {onArrowBackClick()},
                    child: CustomIconButton(
                      width: 30,
                      height: 30,
                      child: CustomImageView(
                        color: ColorSchemes.primaryColorScheme.primary,
                        svgPath: ImageConstant.imgGroup162799,
                      ),
                    ),
                  )),
          ),
        ),
        body: RefreshIndicator(
          onRefresh: onRefresh,
          child: Container(
              padding: getPadding(
                top: getVerticalSize(15),
              ),
              width: mediaQueryData.size.width,
              height: mediaQueryData.size.height,
              child: Stack(
                children: [
                  Obx(
                    () => ListView.separated(
                        itemCount: controller.services.length,
                        separatorBuilder: ((context, index) => Divider()),
                        itemBuilder: (_, index) {
                          Service service = controller.services[index];
                          return InkWell(
                            onTap: () => {
                              controller.onCategoryClicked(service),
                            },
                            child: CategoryItem(
                              category: service,
                            ),
                          );
                        }),
                  ),
                  Obx(() => AnimatedPositioned(
                        duration: Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                        right: homeContainerController.isOpenSidebarCat.isTrue
                            ? 0
                            : -mediaQueryData.size.width,
                        top: 0,
                        bottom: 0,
                        width: mediaQueryData.size.width,
                        child: Visibility(
                          visible:
                              homeContainerController.isOpenSidebarCat.isTrue,
                          child: Container(
                            width: mediaQueryData.size.width,
                            height: mediaQueryData.size.height,
                            decoration: AppDecoration.fillGray,
                            child: Obx(
                              () => ListView.separated(
                                  itemCount: controller.subServices.length,
                                  separatorBuilder: ((context, index) =>
                                      Divider()),
                                  itemBuilder: (_, index) {
                                    Service service =
                                        controller.subServices[index];
                                    return InkWell(
                                      onTap: () => {
                                        onSubCategoryClicked(service),
                                      },
                                      child: CategoryItem(
                                        category: service,
                                      ),
                                    );
                                  }),
                            ),
                          ),
                        ),
                      )),
                  Obx(() => AnimatedPositioned(
                        duration: Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                        right:
                            homeContainerController.isOpenSidebarOffers.isTrue
                                ? 0
                                : -mediaQueryData.size.width,
                        top: 0,
                        bottom: 0,
                        width: mediaQueryData.size.width,
                        child: Visibility(
                          visible: homeContainerController
                              .isOpenSidebarOffers.isTrue,
                          child: Container(
                            padding: getPadding(top: 20),
                            width: mediaQueryData.size.width,
                            height: mediaQueryData.size.height,
                            decoration: AppDecoration.fillGray,
                            child: Obx(
                              () => controller.isLoading.isTrue
                                  ? Container(
                                      child: Center(
                                        child: CircularProgressIndicator(),
                                      ),
                                    )
                                  : controller.offers.isEmpty
                                      ? Container(
                                          child: Center(
                                            child: Text(
                                              'This Sub Category has no offers yet.',
                                              style: CustomTextStyles
                                                  .titleMedium18,
                                            ),
                                          ),
                                        )
                                      : ListView.separated(
                                          itemCount: controller.offers.length,
                                          separatorBuilder: ((context, index) =>
                                              Divider()),
                                          itemBuilder: (_, index) {
                                            if (controller.offers.isEmpty) {}

                                            Offer offer =
                                                controller.offers[index];
                                            return Padding(
                                              padding: getPadding(
                                                  left: 10, right: 10),
                                              child: OfferItemWidget(offer),
                                            );
                                          }),
                            ),
                          ),
                        ),
                      )),
                ],
              )),
        ),
      ),
    );
  }

  Future onRefresh() async {
    final res = await controller.homeController.apiService.getAllServices();
    controller.services.assignAll(res.where((s) => s.isRoot == true));
  }

  onArrowBackClick() {
    if (homeContainerController.isOpenSidebarOffers.isTrue) {
      homeContainerController.isOpenSidebarOffers.value = false;
      controller.offers.assignAll([]);
    } else {
      homeContainerController.isOpenSidebarCat.value = false;
      controller.subServices.assignAll([]);
    }
  }

  onSubCategoryClicked(Service service) {
    controller.selectedSubService.value = service;
    Future.delayed(Duration(milliseconds: 300),
        () => {controller.fetchOffers(service.documentRef!)});
    homeContainerController.isOpenSidebarOffers.value = true;
  }
}

class CategoryItem extends StatelessWidget {
  late final Service? category;
  CategoryItem({this.category});
  @override
  Widget build(BuildContext context) {
    return Container(
      width: mediaQueryData.size.width,
      padding: getPadding(left: 10, right: 10, top: 8, bottom: 8),
      decoration: AppDecoration.fillWhiteA700,
      child: Row(children: [
        CustomImageView(
          width: getHorizontalSize(60),
          height: getVerticalSize(60),
          url: category!.image!,
        ),
        SizedBox(width: getHorizontalSize(24)),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("${category?.name}", style: CustomTextStyles.titleMedium18),
            SizedBox(height: getVerticalSize(7)),
            Container(
              width: mediaQueryData.size.width - getHorizontalSize(120),
              child: Text("${category?.description}",
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: CustomTextStyles.labelLargeGray600),
            ),
          ],
        ),
      ]),
    );
  }
}
