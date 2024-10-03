import '../onboarding_three_screen/widgets/sliderapplicati_item_widget.dart';
import 'controller/onboarding_three_controller.dart';
import 'models/sliderapplicati_item_model.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class OnboardingThreeScreen extends GetWidget<OnboardingThreeController> {
  const OnboardingThreeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            extendBody: true,
            extendBodyBehindAppBar: true,
            body: Container(
                width: mediaQueryData.size.width,
                height: mediaQueryData.size.height,
                decoration: BoxDecoration(
                    image: DecorationImage(
                        image: AssetImage(ImageConstant.imgOnboardingone),
                        fit: BoxFit.cover)),
                child: Container(
                    width: double.maxFinite,
                    padding:
                        getPadding(left: 24, top: 29, right: 24, bottom: 29),
                    child: Container(
                        height: getVerticalSize(699),
                        width: getHorizontalSize(327),
                        margin: getMargin(bottom: 5),
                        child:
                            Stack(alignment: Alignment.bottomCenter, children: [
                          CustomImageView(
                              imagePath: ImageConstant.imgImage422x313,
                              height: getVerticalSize(422),
                              width: getHorizontalSize(313),
                              alignment: Alignment.topCenter),
                          Align(
                              alignment: Alignment.bottomCenter,
                              child: SizedBox(
                                  height: getVerticalSize(367),
                                  width: getHorizontalSize(327),
                                  child: Stack(
                                      alignment: Alignment.bottomCenter,
                                      children: [
                                        Obx(() => CarouselSlider.builder(
                                            options: CarouselOptions(
                                                height: getVerticalSize(367),
                                                initialPage: 0,
                                                autoPlay: true,
                                                viewportFraction: 1.0,
                                                enableInfiniteScroll: false,
                                                scrollDirection:
                                                    Axis.horizontal,
                                                onPageChanged: (index, reason) {
                                                  controller.sliderIndex.value =
                                                      index;
                                                }),
                                            itemCount: controller
                                                .onboardingThreeModelObj
                                                .value
                                                .sliderapplicatiItemList
                                                .value
                                                .length,
                                            itemBuilder:
                                                (context, index, realIndex) {
                                              SliderapplicatiItemModel model =
                                                  controller
                                                      .onboardingThreeModelObj
                                                      .value
                                                      .sliderapplicatiItemList
                                                      .value[index];
                                              return SliderapplicatiItemWidget(
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
                                                        .onboardingThreeModelObj
                                                        .value
                                                        .sliderapplicatiItemList
                                                        .value
                                                        .length,
                                                    axisDirection:
                                                        Axis.horizontal,
                                                    effect: ScrollingDotsEffect(
                                                        spacing: 12,
                                                        activeDotColor: theme
                                                            .colorScheme
                                                            .primary,
                                                        dotColor: theme
                                                            .colorScheme.primary
                                                            .withOpacity(0.41),
                                                        dotHeight:
                                                            getVerticalSize(10),
                                                        dotWidth:
                                                            getHorizontalSize(10))))))
                                      ])))
                        ]))))));
  }

  /// Navigates to the signUpCreateAcountScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the signUpCreateAcountScreen.
  onTapLabel() {
    Get.toNamed(
      AppRoutes.signUpCreateAcountScreen,
    );
  }
}
