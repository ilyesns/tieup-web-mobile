import '../message_action_screen/widgets/message_action_item_widget.dart';
import 'controller/message_action_controller.dart';
import 'models/message_action_item_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/home_page/home_page.dart';
import 'package:Tieup/presentation/message_page/message_page.dart';
import 'package:Tieup/presentation/profile_page/profile_page.dart';
import 'package:Tieup/presentation/order_page/order_page.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_bottom_bar.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_search_view.dart';

class MessageActionScreen extends GetWidget<MessageActionController> {
  const MessageActionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            resizeToAvoidBottomInset: false,
            backgroundColor: appTheme.whiteA70001,
            appBar: CustomAppBar(
                height: getVerticalSize(51),
                leadingWidth: getHorizontalSize(48),
                leading: AppbarImage(
                    svgPath: ImageConstant.imgGroup162799,
                    margin: getMargin(left: 24, top: 13, bottom: 14),
                    onTap: () {
                      onTapArrowbackone();
                    }),
                centerTitle: true,
                title: AppbarTitle(text: "lbl_message".tr)),
            body: Container(
                width: double.maxFinite,
                padding: getPadding(top: 24, bottom: 24),
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      CustomSearchView(
                          margin: getMargin(left: 24, top: 4, right: 24),
                          controller: controller.searchController,
                          hintText: "msg_search_message".tr,
                          hintStyle: CustomTextStyles.titleMediumBluegray400,
                          prefix: Container(
                              margin: getMargin(
                                  left: 16, top: 17, right: 8, bottom: 17),
                              child: CustomImageView(
                                  svgPath: ImageConstant.imgSearch)),
                          prefixConstraints:
                              BoxConstraints(maxHeight: getVerticalSize(52)),
                          suffix: Container(
                              margin: getMargin(
                                  left: 30, top: 17, right: 16, bottom: 17),
                              child: CustomImageView(
                                  svgPath: ImageConstant.imgInfo)),
                          suffixConstraints:
                              BoxConstraints(maxHeight: getVerticalSize(52)),
                          borderDecoration:
                              SearchViewStyleHelper.outlineIndigo),
                      Expanded(
                          child: Padding(
                              padding: getPadding(top: 24),
                              child: Obx(() => ListView.separated(
                                  physics: NeverScrollableScrollPhysics(),
                                  shrinkWrap: true,
                                  separatorBuilder: (context, index) {
                                    return Padding(
                                        padding:
                                            getPadding(top: 7.5, bottom: 7.5),
                                        child: SizedBox(
                                            width: getHorizontalSize(327),
                                            child: Divider(
                                                height: getVerticalSize(1),
                                                thickness: getVerticalSize(1),
                                                color: appTheme.indigo50)));
                                  },
                                  itemCount: controller.messageActionModelObj
                                      .value.messageActionItemList.value.length,
                                  itemBuilder: (context, index) {
                                    MessageActionItemModel model = controller
                                        .messageActionModelObj
                                        .value
                                        .messageActionItemList
                                        .value[index];
                                    return MessageActionItemWidget(model,
                                        onTapChat: () {
                                      onTapChat();
                                    }, onTapRowesther: () {
                                      onTapRowesther();
                                    });
                                  })))),
                      Spacer(),
                      CustomElevatedButton(
                          height: getVerticalSize(46),
                          width: getHorizontalSize(137),
                          text: "lbl_new_chat".tr,
                          margin: getMargin(right: 24),
                          leftIcon: Container(
                              margin: getMargin(right: 4),
                              child: CustomImageView(
                                  svgPath: ImageConstant.imgPlusGray5001)),
                          buttonStyle: CustomButtonStyles.fillPrimaryTL20,
                          buttonTextStyle: CustomTextStyles.titleSmallGray5001,
                          alignment: Alignment.centerRight)
                    ])),
            bottomNavigationBar:
                CustomBottomBar(onChanged: (BottomBarEnum type) {
              Get.toNamed(getCurrentRoute(type), id: 1);
            })));
  }

  ///Handling route based on bottom click actions
  String getCurrentRoute(BottomBarEnum type) {
    switch (type) {
      case BottomBarEnum.Home:
        return AppRoutes.homePage;
      case BottomBarEnum.Message:
        return AppRoutes.messagePage;
      case BottomBarEnum.Order:
        return AppRoutes.orderPage;
      case BottomBarEnum.Profile:
        return AppRoutes.profilePage;
      default:
        return "/";
    }
  }

  ///Handling page based on route
  Widget getCurrentPage(String currentRoute) {
    switch (currentRoute) {
      case AppRoutes.homePage:
        return HomePage();
      case AppRoutes.messagePage:
        return MessagePage();
      case AppRoutes.orderPage:
        return OrderPage();
      case AppRoutes.profilePage:
        return ProfilePage();
      default:
        return DefaultWidget();
    }
  }

  /// Navigates to the chatScreen when the action is triggered.
  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the chatScreen.
  onTapChat() {
    Get.toNamed(AppRoutes.chatScreen);
  }

  /// Navigates to the chatScreen when the action is triggered.
  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the chatScreen.
  onTapRowesther() {
    Get.toNamed(AppRoutes.chatScreen);
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapArrowbackone() {
    Get.back();
  }
}
