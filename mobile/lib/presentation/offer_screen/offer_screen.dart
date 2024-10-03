import 'package:Tieup/core/utils/long_text.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/chat_popup_dialog/chat_popup_dialog.dart';
import 'package:Tieup/presentation/chat_popup_dialog/controller/chat_popup_controller.dart';
import 'package:Tieup/presentation/home_page/widgets/offer_item_widget.dart';
import 'package:Tieup/presentation/offer_screen/controller/offer_controller.dart';

import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/presentation/offer_screen/widgets/gallery_widget.dart';
import 'package:Tieup/presentation/offer_screen/widgets/plan_item.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_image_1.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';

// ignore_for_file: must_be_immutable
class OfferScreen extends GetWidget<OfferController> {
  Offer? offer;
  OfferScreen({Key? key}) : super(key: key) {
    offer = Get.arguments as Offer;
  }
  final AppStateNotifier appStateNotifier = AppStateNotifier.instance;
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
              title: Text(
                "Details",
                style: CustomTextStyles.titleMediumPoppins,
              ),
            ),
            body: Container(
              width: mediaQueryData.size.width,
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Obx(
                      () => GalleryWidget(
                          // ignore: invalid_use_of_protected_member
                          items: controller.galleryItems.value),
                    ),
                    GestureDetector(
                      onTap: () {
                        onBarProfileClick();
                      },
                      child: Container(
                        decoration: AppDecoration.outlineBlueGray,
                        child: Padding(
                          padding: getPadding(
                              top: 6, left: 10, right: 10, bottom: 6),
                          child: Row(
                            mainAxisSize: MainAxisSize.max,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  CustomImageView(
                                    url: offer!.extraData!.user!.photoURL,
                                    width: 45,
                                    height: 45,
                                    radius: BorderRadius.circular(50),
                                  ),
                                  SizedBox(
                                    width: getVerticalSize(10),
                                  ),
                                  Column(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        offer!.extraData!.user!.username ?? '',
                                        style: CustomTextStyles
                                            .labelLargeGray600SemiBold,
                                      ),
                                      Text(
                                        offer!.extraData!.freelancerProfile!
                                                .sellerLevel ??
                                            '',
                                        style:
                                            CustomTextStyles.labelLargePrimary,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              CustomIconButton(
                                width: getSize(21),
                                height: getSize(21),
                                child: CustomImageView(
                                  svgPath: ImageConstant.imgArrowdown,
                                  color: Colors.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Container(
                      padding: getPadding(top: 15, left: 10, right: 10),
                      child: Column(
                        children: [
                          Text(
                            "${offer!.title ?? ''}",
                            style: CustomTextStyles.titleMedium18,
                          ),
                          SizedBox(height: getSize(5)),
                          LongText(text: offer!.description ?? ''),
                        ],
                      ),
                    ),
                    SizedBox(
                      height: getVerticalSize(10),
                    ),
                    Container(
                      color: Colors.white,
                      child: TabBar(
                          dividerColor: Colors.grey[200],
                          controller: controller.tabController,
                          tabs: [
                            Tab(
                              child: Text(
                                  '${offer!.basicPlan!.price!.toInt().toString()} DT'),
                            ),
                            Tab(
                              child: Text(
                                  '${offer!.premiumPlan!.price!.toInt().toString()} DT'),
                            ),
                          ]),
                    ),
                    Container(
                      height: 350,
                      child: TabBarView(
                        controller: controller.tabController,
                        children: [
                          // Contents of Tab 1
                          Center(
                            child: PlanWidget(
                                plan: offer!.basicPlan!, offer: offer!),
                          ),
                          // Contents of Tab 2
                          Center(
                            child: PlanWidget(
                              plan: offer!.premiumPlan!,
                              offer: offer!,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Padding(
                      padding: getPadding(left: 10, right: 10, top: 0),
                      child: Text('Recommended for you',
                          style: CustomTextStyles.titleMediumInter),
                    ),
                    Padding(
                      padding:
                          getPadding(left: 10, right: 10, top: 15, bottom: 15),
                      child: Obx(() => controller.isLoading.isTrue
                          ? Center(
                              child: CircularProgressIndicator(),
                            )
                          : Container(
                              height: 110,
                              child: ListView.separated(
                                  shrinkWrap: true,
                                  scrollDirection: Axis.horizontal,
                                  separatorBuilder: (_, index) => SizedBox(
                                        width: 8,
                                      ),
                                  itemCount:
                                      controller.recommendedOffers.length,
                                  itemBuilder: (_, index) {
                                    return OfferItemWidget(
                                        controller.recommendedOffers[index]);
                                  }),
                            )),
                    ),
                  ],
                ),
              ),
            ),
            floatingActionButton: InkWell(
              onTap: () {
                if (appStateNotifier.loggedIn) {
                  onChatBoxClick();
                } else {
                  Get.rawSnackbar(
                      messageText: Text(
                        'Please login to get in touch with ${offer!.extraData!.user!.username!}',
                        style: TextStyle(color: Colors.white),
                      ),
                      backgroundColor: Colors.black);
                }
              },
              child: Container(
                height: getVerticalSize(50),
                width: getHorizontalSize(100),
                decoration: AppDecoration.fillPrimary.copyWith(
                  borderRadius: BorderRadiusStyle.roundedBorder44,
                ),
                child: Padding(
                  padding: const EdgeInsets.all(3),
                  child: Row(children: [
                    CustomImageView(
                        url: offer!.extraData!.user!.photoURL!,
                        height: 50,
                        width: 50,
                        radius: BorderRadius.circular(50)),
                    SizedBox(
                      width: 5,
                    ),
                    Text(
                      'Chat',
                      style: TextStyle(color: Colors.white),
                    )
                  ]),
                ),
              ),
            )));
  }

  onTapArrowbackone() {
    Get.back();
  }

  onChatBoxClick() async {
    await controller.checkExistChat(offer!.freelancerId!);
    Get.bottomSheet(
      ChatDialog(
          chatId: controller.chatId.value, otherUser: offer!.extraData!.user!),
      enableDrag: true,
      isScrollControlled: true,
    );
  }

  onBarProfileClick() async {
    Get.bottomSheet(
        Container(
          width: mediaQueryData.size.width,
          child: SingleChildScrollView(
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
                  padding: getPadding(top: 10, left: 10, right: 10, bottom: 10),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Padding(
                            padding: getPadding(bottom: 10),
                            child: Text(
                              "${offer!.extraData!.user!.username ?? ''} Profile",
                              style: CustomTextStyles.titleMedium15,
                            ),
                          ),
                        ],
                      ),
                      Divider(),
                      Padding(
                        padding: getPadding(top: 15),
                        child: Row(
                          children: [
                            CustomImageView(
                              url: offer!.extraData!.user!.photoURL,
                              width: 80,
                              height: 80,
                              radius: BorderRadius.circular(50),
                            ),
                            Padding(
                              padding: getPadding(left: 15),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${offer!.extraData!.user!.firstName ?? ''} ${offer!.extraData!.user!.lastName ?? ''}',
                                    style: CustomTextStyles.titleMedium15,
                                  ),
                                  SizedBox(
                                    height: 10,
                                  ),
                                  Text(
                                    '${offer!.extraData!.freelancerProfile!.sellerLevel ?? ''}',
                                    style: theme.textTheme.bodyMedium!.copyWith(
                                        color: theme.colorScheme.primary),
                                  ),
                                ],
                              ),
                            )
                          ],
                        ),
                      ),
                      Padding(
                        padding: getPadding(top: 15),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'About me:',
                              style: CustomTextStyles.titleMedium15,
                            ),
                            SizedBox(
                              height: 8,
                            ),
                            LongText(text: offer!.extraData!.user!.description!)
                          ],
                        ),
                      ),
                      if (offer!.extraData!.user!.skills != null &&
                          offer!.extraData!.user!.skills!.length > 0)
                        Padding(
                          padding: getPadding(top: 15),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Skills:',
                                style: CustomTextStyles.titleMedium15,
                              ),
                              SizedBox(
                                height: 8,
                              ),
                              ...(offer!.extraData!.user!.skills ?? [])
                                  .map((skill) => Container(
                                      child: Text(
                                          '${skill.name} - ${skill.experience} ')))
                                  .toList(),
                            ],
                          ),
                        ),
                      if (offer!.extraData!.user!.educations != null &&
                          offer!.extraData!.user!.educations!.length > 0)
                        Padding(
                          padding: getPadding(top: 15),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Educations:',
                                style: CustomTextStyles.titleMedium15,
                              ),
                              SizedBox(
                                height: 8,
                              ),
                              ...(offer!.extraData!.user!.educations ?? [])
                                  .map((education) => Container(
                                      child: Text(
                                          '${education.title} - ${education.yearGrad} ')))
                                  .toList(),
                            ],
                          ),
                        ),
                      if (offer!.extraData!.user!.certifications != null &&
                          offer!.extraData!.user!.certifications!.length > 0)
                        Padding(
                          padding: getPadding(top: 15),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Certifications:',
                                style: CustomTextStyles.titleMedium15,
                              ),
                              SizedBox(
                                height: 8,
                              ),
                              ...(offer!.extraData!.user!.certifications ?? [])
                                  .map((certif) => Container(
                                      margin: getMargin(bottom: 5),
                                      child: Text(
                                          '${certif.title} - ${certif.yearObtain} ')))
                                  .toList(),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        isScrollControlled: true);
  }
}
