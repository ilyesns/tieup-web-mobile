import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/data/models/message/message.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/message_action_screen/message_action_screen.dart';
import 'package:Tieup/presentation/message_popup_dialog/message_popup_dialog.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';
import 'package:Tieup/widgets/loading_widget.dart';

import 'controller/chat_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';

class ChatScreen extends GetWidget<ChatController> {
  Chat? chat;
  ChatScreen({Key? key}) : super(key: key) {
    chat = Get.arguments as Chat?;
  }

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
            title: AppbarTitle(text: '${chat!.extraData!.username}')),
        body: Container(
          width: mediaQueryData.size.width,
          height: mediaQueryData.size.height,
          padding: getPadding(left: 24, top: 28, right: 24, bottom: 28),
          child: Column(
            children: [
              Expanded(
                child: StreamBuilder<List<Message>>(
                    stream: controller.messagesStream,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return LoadingWidget();
                      }
                      if (!snapshot.hasData) {
                        return Center(
                          child: Container(
                            child: Text('empty list'),
                          ),
                        );
                      }
                      if (snapshot.hasError) {
                        return Center(
                          child: Container(
                            child: Text('Something went wrong!'),
                          ),
                        );
                      }

                      List<Message> messages = snapshot.data!;

                      return ListView.builder(
                        controller: controller.scrollController,
                        itemCount: messages.length,
                        shrinkWrap: true,
                        itemBuilder: ((context, index) {
                          Message message = messages[index];
                          DateTime currentTime = message.createdAt!;
                          DateTime? previousTime =
                              index > 0 ? messages[index - 1].createdAt : null;

                          // Check if a divider should be displayed for the current message
                          bool displayDivider =
                              shouldDisplayDivider(previousTime, currentTime);

                          // Build UI for message with divider if necessary
                          return Column(
                            children: [
                              if (displayDivider) ...[
                                // Display divider with day and month
                                Container(
                                  padding: EdgeInsets.symmetric(vertical: 8),
                                  alignment: Alignment.center,
                                  child: Text(
                                    '${currentTime.day}/${currentTime.month}',
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ),
                              ],
                              // Build UI for message
                              message.userSent == currentUser.value!.userId
                                  ? GestureDetector(
                                      onLongPress: () {
                                        onTapHolder(message);
                                      },
                                      child: RightMessageUser(
                                        message: message,
                                      ),
                                    )
                                  : LeftMessageUser(
                                      userPhotoURL:
                                          chat!.extraData!.userPhotoURL,
                                      message: message),
                            ],
                          );
                        }),
                      );
                    }),
              ),
              Container(
                width: mediaQueryData.size.width,
                padding: getMargin(left: 5, right: 5, bottom: 5),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Column(
                      children: [
                        Obx(
                          () => controller.file.value != null
                              ? CustomImageView(
                                  width: 25,
                                  height: 25,
                                  svgPath: ImageConstant.imgRemoveIcon,
                                  color: theme.colorScheme.secondary,
                                  onTap: () {
                                    controller.file.value = null;
                                  },
                                )
                              : CustomImageView(
                                  width: 25,
                                  height: 25,
                                  svgPath: ImageConstant.imgAttachIcon,
                                  color: theme.colorScheme.primary,
                                  onTap: () {
                                    controller.pickFile();
                                  },
                                ),
                        ),
                        Obx(
                          () => Row(
                            children: [
                              CustomImageView(
                                width: 20,
                                height: 20,
                                file: controller.file.value,
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: CustomTextFormField(
                          autofocus: false,
                          focusNode: controller.messageFocus,
                          controller: controller.messageController,
                          hintText: "msg_type_your_message".tr,
                          hintStyle: CustomTextStyles.labelLargeGray600,
                          textInputAction: TextInputAction.done,
                          contentPadding: getPadding(
                              left: 30, top: 13, right: 30, bottom: 13),
                          borderDecoration: TextFormFieldStyleHelper.fillGray,
                          fillColor: appTheme.gray20001),
                    ),
                    SizedBox(width: 12),
                    Obx(
                      () => controller.isSending.isTrue
                          ? Container(
                              width: 30,
                              height: 30,
                              child: CircularProgressIndicator(),
                            )
                          : CustomImageView(
                              width: 30,
                              height: 30,
                              svgPath: ImageConstant.imgArrowRight,
                              color: theme.colorScheme.primary,
                              onTap: () {
                                if (controller.messageController.text != '') {
                                  controller.sendMessage();
                                }
                              },
                            ),
                    )
                  ],
                ),
              )
            ],
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

  onTapHolder(Message message) {
    Get.dialog(AlertDialog(
        backgroundColor: Colors.transparent,
        contentPadding: EdgeInsets.zero,
        insetPadding: const EdgeInsets.only(left: 0),
        content: MessageDialog(message: message)));
  }
}

class LeftMessageUser extends StatelessWidget {
  LeftMessageUser({
    Key? key,
    required this.message,
    this.userPhotoURL,
  }) : super(key: key);
  Message message;
  String? userPhotoURL;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (message.imageUrl != null)
            Container(
              padding: getPadding(left: 44, top: 6),
              child:
                  CustomImageView(fit: BoxFit.fill, url: message.imageUrl!.url),
            ),
          Padding(
            padding: getPadding(right: 80, top: 6),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                    height: getSize(32),
                    width: getSize(32),
                    margin: getMargin(bottom: 6),
                    child: Stack(alignment: Alignment.bottomRight, children: [
                      userPhotoURL != null
                          ? CustomImageView(
                              url: userPhotoURL,
                              fit: BoxFit.cover,
                              height: getSize(32),
                              width: getSize(32),
                              radius:
                                  BorderRadius.circular(getHorizontalSize(16)),
                              alignment: Alignment.center)
                          : CustomImageView(
                              imagePath: ImageConstant.imgAvatar,
                              height: getSize(32),
                              width: getSize(32),
                              radius:
                                  BorderRadius.circular(getHorizontalSize(16)),
                              alignment: Alignment.center),
                      Align(
                          alignment: Alignment.bottomRight,
                          child: Container(
                              height: getSize(8),
                              width: getSize(8),
                              decoration: BoxDecoration(
                                  color: appTheme.tealA700,
                                  borderRadius: BorderRadius.circular(
                                      getHorizontalSize(4)),
                                  border: Border.all(
                                      color: theme
                                          .colorScheme.onPrimaryContainer
                                          .withOpacity(1),
                                      width: getHorizontalSize(1)))))
                    ])),
                Container(
                  margin: getMargin(left: 12),
                  padding: getPadding(left: 12, top: 10, right: 12, bottom: 10),
                  decoration: AppDecoration.fillGray.copyWith(
                      borderRadius: BorderRadiusStyle.customBorderTL241),
                  child: Container(
                    width: getHorizontalSize(164),
                    margin: getMargin(top: 4, right: 14),
                    child: Text(
                      message.text!,
                      style: CustomTextStyles.titleSmallGray600
                          .copyWith(height: 1.57),
                    ),
                  ),
                )
              ],
            ),
          ),
          Padding(
              padding: getPadding(
                left: 44,
              ),
              child: Text(formatTime(message.createdAt!),
                  style: CustomTextStyles.labelMediumBluegray300)),
        ],
      ),
    );
  }
}

class RightMessageUser extends StatelessWidget {
  RightMessageUser({
    Key? key,
    required this.message,
  }) : super(key: key);
  Message message;
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (message.imageUrl != null)
          Container(
            padding: getPadding(top: 6, right: 44),
            child:
                CustomImageView(fit: BoxFit.fill, url: message.imageUrl!.url),
          ),
        if (message.fileUrl != null)
          Container(
            decoration: AppDecoration.fillGray200
                .copyWith(borderRadius: BorderRadius.all(Radius.circular(6))),
            margin: getMargin(top: 6, right: 44),
            padding: EdgeInsets.all(5),
            child: Text(message.fileUrl!.name),
          ),
        Align(
          alignment: Alignment.centerRight,
          child: Padding(
            padding: getPadding(left: 97, top: 26),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Expanded(
                  child: Container(
                    margin: getMargin(left: 12),
                    padding:
                        getPadding(left: 12, top: 10, right: 12, bottom: 10),
                    decoration: AppDecoration.fillGray.copyWith(
                        borderRadius: BorderRadiusStyle.customBorderTL241,
                        color: theme.colorScheme.primary),
                    child: Container(
                      width: getHorizontalSize(164),
                      margin: getMargin(top: 4, right: 14),
                      child: Text(
                        message.text!,
                        style: CustomTextStyles.titleSmallGray5001_1
                            .copyWith(height: 1.57),
                      ),
                    ),
                  ),
                ),
                currentUser.value!.photoURL != null
                    ? CustomImageView(
                        url: currentUser.value!.photoURL,
                        height: getSize(32),
                        width: getSize(32),
                        radius: BorderRadius.circular(getHorizontalSize(16)),
                        margin: getMargin(left: 12, top: 7, bottom: 7),
                      )
                    : CustomImageView(
                        imagePath: ImageConstant.imgProfileGray100,
                        height: getSize(32),
                        width: getSize(32),
                        radius: BorderRadius.circular(getHorizontalSize(16)),
                        margin: getMargin(left: 12, top: 7, bottom: 7),
                      ),
              ],
            ),
          ),
        ),
        Align(
          alignment: Alignment.centerRight,
          child: Padding(
            padding: getPadding(top: 6, right: 44),
            child: Text(formatTime(message.createdAt!),
                style: CustomTextStyles.labelMediumBluegray300),
          ),
        ),
      ],
    );
  }
}
