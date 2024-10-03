import '../profile_page/widgets/chipviewskills_item_widget.dart';
import '../profile_page/widgets/profile_item_widget.dart';
import 'controller/profile_controller.dart';
import 'models/chipviewskills_item_model.dart';
import 'models/profile_item_model.dart';
import 'models/profile_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_image_1.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_checkbox_button.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';

// ignore_for_file: must_be_immutable
class ProfilePage extends StatelessWidget {
  ProfilePage({Key? key}) : super(key: key);

  ProfileController controller = Get.put(ProfileController(ProfileModel().obs));

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
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
                title: AppbarTitle(text: "lbl_profile".tr),
                actions: [
                  AppbarImage1(
                      svgPath: ImageConstant.imgGroup162903,
                      margin:
                          getMargin(left: 24, top: 13, right: 24, bottom: 13),
                      onTap: () {
                        onTapImage();
                      })
                ]),
            body: SizedBox(
                width: mediaQueryData.size.width,
                child: SingleChildScrollView(
                    padding: getPadding(top: 30),
                    child: Padding(
                        padding: getPadding(bottom: 5),
                        child: Column(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              SizedBox(
                                  height: getVerticalSize(225),
                                  width: getHorizontalSize(327),
                                  child: Stack(
                                      alignment: Alignment.bottomCenter,
                                      children: [
                                        CustomImageView(
                                            imagePath: ImageConstant.imgBg,
                                            height: getVerticalSize(120),
                                            width: getHorizontalSize(327),
                                            radius: BorderRadius.circular(
                                                getHorizontalSize(8)),
                                            alignment: Alignment.topCenter),
                                        Align(
                                            alignment: Alignment.bottomCenter,
                                            child: Padding(
                                                padding: getPadding(
                                                    left: 87, right: 87),
                                                child: Column(
                                                    mainAxisSize:
                                                        MainAxisSize.min,
                                                    mainAxisAlignment:
                                                        MainAxisAlignment.start,
                                                    children: [
                                                      CustomImageView(
                                                          imagePath:
                                                              ImageConstant
                                                                  .img63,
                                                          height: getSize(89),
                                                          width: getSize(89),
                                                          radius: BorderRadius
                                                              .circular(
                                                                  getHorizontalSize(
                                                                      44))),
                                                      Padding(
                                                          padding: getPadding(
                                                              top: 9),
                                                          child: Text(
                                                              "msg_gustavo_lipshutz"
                                                                  .tr,
                                                              style: CustomTextStyles
                                                                  .titleMediumErrorContainer)),
                                                      Obx(() =>
                                                          CustomCheckboxButton(
                                                              text:
                                                                  "lbl_open_to_work"
                                                                      .tr,
                                                              value: controller
                                                                  .opentowork
                                                                  .value,
                                                              margin: getMargin(
                                                                  top: 5),
                                                              textStyle:
                                                                  CustomTextStyles
                                                                      .titleSmallPoppinsBluegray300,
                                                              onChange:
                                                                  (value) {
                                                                controller
                                                                    .opentowork
                                                                    .value = value;
                                                              }))
                                                    ])))
                                      ])),
                              Container(
                                  width: getHorizontalSize(272),
                                  margin:
                                      getMargin(left: 52, top: 15, right: 50),
                                  child: Text("msg_ui_ux_designer".tr,
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                      textAlign: TextAlign.center,
                                      style: theme.textTheme.bodyMedium!
                                          .copyWith(height: 1.57))),
                              Padding(
                                  padding:
                                      getPadding(left: 24, top: 17, right: 24),
                                  child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Container(
                                            width: getHorizontalSize(154),
                                            padding: getPadding(
                                                left: 40,
                                                top: 12,
                                                right: 40,
                                                bottom: 12),
                                            decoration: AppDecoration
                                                .fillGray200
                                                .copyWith(
                                                    borderRadius:
                                                        BorderRadiusStyle
                                                            .roundedBorder24),
                                            child: Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.end,
                                                children: [
                                                  Padding(
                                                      padding:
                                                          getPadding(top: 2),
                                                      child: Text("lbl_25".tr,
                                                          style: CustomTextStyles
                                                              .titleMediumBold_1)),
                                                  Padding(
                                                      padding: getPadding(
                                                          left: 8, top: 5),
                                                      child: Text(
                                                          "lbl_applied".tr,
                                                          style: theme.textTheme
                                                              .labelLarge))
                                                ])),
                                        Container(
                                            width: getHorizontalSize(154),
                                            margin: getMargin(left: 19),
                                            padding: getPadding(
                                                left: 35,
                                                top: 12,
                                                right: 35,
                                                bottom: 12),
                                            decoration: AppDecoration
                                                .fillGray200
                                                .copyWith(
                                                    borderRadius:
                                                        BorderRadiusStyle
                                                            .roundedBorder24),
                                            child: Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.center,
                                                children: [
                                                  Padding(
                                                      padding:
                                                          getPadding(top: 2),
                                                      child: Text("lbl_10".tr,
                                                          style: CustomTextStyles
                                                              .titleMediumBold_1)),
                                                  Padding(
                                                      padding: getPadding(
                                                          left: 8,
                                                          top: 2,
                                                          bottom: 3),
                                                      child: Text(
                                                          "lbl_reviewed".tr,
                                                          style: theme.textTheme
                                                              .labelLarge))
                                                ]))
                                      ])),
                              Padding(
                                  padding: getPadding(top: 24),
                                  child: Divider(color: appTheme.indigo50)),
                              Container(
                                  margin:
                                      getMargin(left: 24, top: 22, right: 24),
                                  padding: getPadding(
                                      left: 16, top: 14, right: 16, bottom: 14),
                                  decoration: AppDecoration.outlineIndigo
                                      .copyWith(
                                          borderRadius:
                                              BorderRadiusStyle.circleBorder12),
                                  child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Padding(
                                                  padding: getPadding(
                                                      top: 2, bottom: 1),
                                                  child: Text("lbl_about_me".tr,
                                                      style: CustomTextStyles
                                                          .titleMediumInter)),
                                              CustomImageView(
                                                  svgPath: ImageConstant
                                                      .imgEditsquare,
                                                  height: getSize(24),
                                                  width: getSize(24))
                                            ]),
                                        Container(
                                            width: getHorizontalSize(272),
                                            margin:
                                                getMargin(top: 14, right: 22),
                                            child: Text(
                                                "msg_lorem_ipsum_dolor8".tr,
                                                maxLines: 5,
                                                overflow: TextOverflow.ellipsis,
                                                style: CustomTextStyles
                                                    .titleSmallBluegray400_1
                                                    .copyWith(height: 1.57)))
                                      ])),
                              Container(
                                  margin:
                                      getMargin(left: 23, top: 24, right: 23),
                                  padding: getPadding(
                                      left: 9, top: 16, right: 9, bottom: 16),
                                  decoration: AppDecoration.outlineIndigo
                                      .copyWith(
                                          borderRadius:
                                              BorderRadiusStyle.circleBorder12),
                                  child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      children: [
                                        Padding(
                                            padding:
                                                getPadding(left: 7, right: 7),
                                            child: Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment
                                                        .spaceBetween,
                                                children: [
                                                  Padding(
                                                      padding: getPadding(
                                                          top: 1, bottom: 2),
                                                      child: Text(
                                                          "lbl_skills".tr,
                                                          style: CustomTextStyles
                                                              .titleMediumInter)),
                                                  CustomImageView(
                                                      svgPath: ImageConstant
                                                          .imgEditsquare,
                                                      height: getSize(24),
                                                      width: getSize(24))
                                                ])),
                                        Padding(
                                            padding:
                                                getPadding(top: 12, bottom: 17),
                                            child: Obx(() => Wrap(
                                                runSpacing: getVerticalSize(12),
                                                spacing: getHorizontalSize(12),
                                                children: List<Widget>.generate(
                                                    controller
                                                        .profileModelObj
                                                        .value
                                                        .chipviewskillsItemList
                                                        .value
                                                        .length, (index) {
                                                  ChipviewskillsItemModel
                                                      model = controller
                                                          .profileModelObj
                                                          .value
                                                          .chipviewskillsItemList
                                                          .value[index];
                                                  return ChipviewskillsItemWidget(
                                                      model);
                                                }))))
                                      ])),
                              Container(
                                  margin:
                                      getMargin(left: 24, top: 24, right: 24),
                                  padding: getPadding(
                                      left: 16, top: 15, right: 16, bottom: 15),
                                  decoration: AppDecoration.outlineIndigo
                                      .copyWith(
                                          borderRadius:
                                              BorderRadiusStyle.circleBorder12),
                                  child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Padding(
                                                  padding: getPadding(top: 2),
                                                  child: Text(
                                                      "lbl_experience".tr,
                                                      style: CustomTextStyles
                                                          .titleMediumBold)),
                                              CustomImageView(
                                                  svgPath: ImageConstant
                                                      .imgEditsquarePrimary,
                                                  height: getSize(24),
                                                  width: getSize(24))
                                            ]),
                                        Padding(
                                            padding: getPadding(top: 22),
                                            child: Obx(() => ListView.separated(
                                                physics:
                                                    NeverScrollableScrollPhysics(),
                                                shrinkWrap: true,
                                                separatorBuilder:
                                                    (context, index) {
                                                  return Padding(
                                                      padding: getPadding(
                                                          top: 11.5,
                                                          bottom: 11.5),
                                                      child: SizedBox(
                                                          width:
                                                              getHorizontalSize(
                                                                  235),
                                                          child: Divider(
                                                              height:
                                                                  getVerticalSize(
                                                                      1),
                                                              thickness:
                                                                  getVerticalSize(
                                                                      1),
                                                              color: appTheme
                                                                  .indigo50)));
                                                },
                                                itemCount: controller
                                                    .profileModelObj
                                                    .value
                                                    .profileItemList
                                                    .value
                                                    .length,
                                                itemBuilder: (context, index) {
                                                  ProfileItemModel model =
                                                      controller
                                                          .profileModelObj
                                                          .value
                                                          .profileItemList
                                                          .value[index];
                                                  return ProfileItemWidget(
                                                      model);
                                                })))
                                      ])),
                              Container(
                                  margin:
                                      getMargin(left: 24, top: 24, right: 24),
                                  padding: getPadding(all: 16),
                                  decoration: AppDecoration.outlineBluegray50
                                      .copyWith(
                                          borderRadius:
                                              BorderRadiusStyle.circleBorder12),
                                  child: Column(
                                      mainAxisSize: MainAxisSize.min,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      mainAxisAlignment:
                                          MainAxisAlignment.start,
                                      children: [
                                        Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Padding(
                                                  padding: getPadding(top: 2),
                                                  child: Text(
                                                      "lbl_education".tr,
                                                      style: CustomTextStyles
                                                          .titleMediumBold_1)),
                                              CustomImageView(
                                                  svgPath: ImageConstant
                                                      .imgEditsquarePrimary,
                                                  height: getSize(24),
                                                  width: getSize(24))
                                            ]),
                                        Padding(
                                            padding:
                                                getPadding(top: 24, right: 83),
                                            child: Row(children: [
                                              CustomIconButton(
                                                  height: getSize(48),
                                                  width: getSize(48),
                                                  padding: getPadding(all: 8),
                                                  child: CustomImageView(
                                                      svgPath: ImageConstant
                                                          .imgFrame162724)),
                                              Expanded(
                                                  child: Padding(
                                                      padding: getPadding(
                                                          left: 12, top: 5),
                                                      child: Column(
                                                          crossAxisAlignment:
                                                              CrossAxisAlignment
                                                                  .start,
                                                          mainAxisAlignment:
                                                              MainAxisAlignment
                                                                  .start,
                                                          children: [
                                                            Text(
                                                                "msg_university_of_oxford"
                                                                    .tr,
                                                                style: CustomTextStyles
                                                                    .titleSmallPrimarySemiBold),
                                                            Padding(
                                                                padding:
                                                                    getPadding(
                                                                        top: 6),
                                                                child: Row(
                                                                    children: [
                                                                      Padding(
                                                                          padding: getPadding(
                                                                              top:
                                                                                  1),
                                                                          child: Text(
                                                                              "msg_computer_science".tr,
                                                                              style: theme.textTheme.labelLarge)),
                                                                      Padding(
                                                                          padding: getPadding(
                                                                              left:
                                                                                  4,
                                                                              top:
                                                                                  1),
                                                                          child: Text(
                                                                              "lbl".tr,
                                                                              style: theme.textTheme.labelLarge)),
                                                                      Padding(
                                                                          padding: getPadding(
                                                                              left:
                                                                                  4),
                                                                          child: Text(
                                                                              "lbl_2019".tr,
                                                                              style: theme.textTheme.labelLarge))
                                                                    ]))
                                                          ])))
                                            ]))
                                      ]))
                            ]))))));
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapArrowbackone() {
    Get.back();
  }

  /// Navigates to the settingsScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the settingsScreen.
  onTapImage() {
    // Get.toNamed(
    //   AppRoutes.settingsScreen,
    // );
  }
}
