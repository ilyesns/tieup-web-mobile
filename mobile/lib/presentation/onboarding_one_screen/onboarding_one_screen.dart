import '../onboarding_one_screen/widgets/sliderthebestap_item_widget.dart';
import 'controller/onboarding_one_controller.dart';
import 'models/sliderthebestap_item_model.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_subtitle_1.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class OnboardingOneScreen extends GetWidget<OnboardingOneController> {
  const OnboardingOneScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            extendBody: true,
            extendBodyBehindAppBar: true,
            appBar: CustomAppBar(height: getVerticalSize(49), actions: [
              AppbarSubtitle1(
                  text: "lbl_skip".tr,
                  margin: getMargin(left: 24, top: 13, right: 24, bottom: 13),
                  onTap: () {
                    onTapMediumlabelmedi();
                  })
            ]),
            body: Container(
                width: mediaQueryData.size.width,
                height: mediaQueryData.size.height,
                padding: getPadding(top: 45),
                decoration: BoxDecoration(
                    image: DecorationImage(
                        image: AssetImage(ImageConstant.imgOnboardingone),
                        fit: BoxFit.cover)),
                child: SingleChildScrollView(
                  child: Container(
                      height: getVerticalSize(720),
                      width: double.maxFinite,
                      padding: getPadding(left: 24, right: 24),
                      child:
                          Stack(alignment: Alignment.bottomCenter, children: [
                        CustomImageView(
                            imagePath: ImageConstant.imgImage,
                            height: getVerticalSize(361),
                            width: getHorizontalSize(283),
                            alignment: Alignment.topCenter),
                        Align(
                            alignment: Alignment.bottomCenter,
                            child: Container(
                                height: getVerticalSize(350),
                                width: getHorizontalSize(327),
                                margin: getMargin(bottom: 5),
                                child: Stack(
                                    alignment: Alignment.bottomCenter,
                                    children: [
                                      Obx(() => CarouselSlider.builder(
                                          options: CarouselOptions(
                                              height: getVerticalSize(350),
                                              initialPage: 0,
                                              autoPlay: true,
                                              viewportFraction: 1.0,
                                              enableInfiniteScroll: false,
                                              scrollDirection: Axis.horizontal,
                                              onPageChanged: (index, reason) {
                                                controller.sliderIndex.value =
                                                    index;
                                              }),
                                          itemCount: controller
                                              .onboardingOneModelObj
                                              .value
                                              .sliderthebestapItemList
                                              .value
                                              .length,
                                          itemBuilder:
                                              (context, index, realIndex) {
                                            SliderthebestapItemModel model =
                                                controller
                                                    .onboardingOneModelObj
                                                    .value
                                                    .sliderthebestapItemList
                                                    .value[index];
                                            return SliderthebestapItemWidget(
                                                model, onTapLabel: () {
                                              onTapLabel();
                                            });
                                          })),
                                      Align(
                                          alignment: Alignment.bottomCenter,
                                          child: Obx(() => Container(
                                              height: getVerticalSize(10),
                                              margin: getMargin(bottom: 112),
                                              child: AnimatedSmoothIndicator(
                                                  activeIndex: controller
                                                      .sliderIndex.value,
                                                  count: controller
                                                      .onboardingOneModelObj
                                                      .value
                                                      .sliderthebestapItemList
                                                      .value
                                                      .length,
                                                  axisDirection:
                                                      Axis.horizontal,
                                                  effect: ScrollingDotsEffect(
                                                      spacing: 12,
                                                      activeDotColor: theme
                                                          .colorScheme.primary,
                                                      dotColor: theme
                                                          .colorScheme.primary
                                                          .withOpacity(0.41),
                                                      dotHeight:
                                                          getVerticalSize(10),
                                                      dotWidth:
                                                          getHorizontalSize(10))))))
                                    ])))
                      ])),
                ))));
  }

  /// Navigates to the onboardingTwoScreen when the action is triggered.
  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the onboardingTwoScreen.
  onTapLabel() {
    Get.toNamed(AppRoutes.onboardingTwoScreen);
  }

  /// Navigates to the signUpCreateAcountScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the signUpCreateAcountScreen.
  onTapMediumlabelmedi() {
    Get.toNamed(
      AppRoutes.signUpCreateAcountScreen,
    );
  }
}
