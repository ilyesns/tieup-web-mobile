import 'dart:ui';

import 'package:flutter/scheduler.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/models/message/message.dart';
import 'package:Tieup/data/models/user/user.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/firebase/firebase_auth.dart';

import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/chat_popup_dialog/controller/chat_popup_controller.dart';
import 'package:Tieup/presentation/chat_screen/chat_screen.dart';
import 'package:Tieup/presentation/chat_screen/controller/chat_controller.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_outlined_button.dart';
import 'package:Tieup/widgets/custom_text_form_field.dart';
import 'package:Tieup/widgets/loading_widget.dart';

// ignore_for_file: must_be_immutable
class ChatDialog extends StatefulWidget {
  ChatDialog({Key? key, required this.otherUser, this.chatId})
      : super(key: key);
  late User otherUser;
  String? chatId;

  @override
  State<ChatDialog> createState() => _ChatDialogState();
}

class _ChatDialogState extends State<ChatDialog> {
  final authManager = AuthManager();

  final controller = ChatPopupController();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    controller.chatId.value = widget.chatId;
    controller.scrollController = ScrollController();
    SchedulerBinding.instance.addPostFrameCallback((_) {
      if (controller.scrollController.hasClients) {
        controller.scrollController.animateTo(
            controller.scrollController.position.maxScrollExtent,
            duration: const Duration(milliseconds: 150),
            curve: Curves.easeOut);
      }
    });
    controller.initMessagesStream();
  }

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return ClipRRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: 0,
          sigmaY: 0,
        ),
        child: Container(
          width: double.infinity,
          height: double.infinity,
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
                height: 500,
                padding: getPadding(top: 10, left: 10, right: 10, bottom: 10),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: getPadding(bottom: 10),
                      child: Row(
                        mainAxisSize: MainAxisSize.max,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          CustomImageView(
                            url: widget.otherUser.photoURL,
                            width: 45,
                            height: 45,
                            radius: BorderRadius.circular(50),
                          ),
                          SizedBox(
                            width: 10,
                          ),
                          Text(
                            "${widget.otherUser.username}",
                            style: CustomTextStyles.titleMedium18,
                          ),
                        ],
                      ),
                    ),
                    Divider(height: 0.5),
                    Expanded(
                      child: Obx(
                        () => Container(
                          margin: getMargin(top: 10),
                          decoration: AppDecoration.outlineIndigo,
                          child: controller.chatId.value != null
                              ? Container(
                                  child: StreamBuilder<List<Message>>(
                                      stream: controller.messagesStream,
                                      builder: (context, snapshot) {
                                        if (snapshot.connectionState ==
                                            ConnectionState.waiting) {
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
                                              child:
                                                  Text('Something went wrong!'),
                                            ),
                                          );
                                        }

                                        List<Message> messages = snapshot.data!;

                                        return ListView.builder(
                                          controller:
                                              controller.scrollController,
                                          itemCount: messages.length,
                                          shrinkWrap: true,
                                          itemBuilder: ((context, index) {
                                            Message message = messages[index];
                                            DateTime currentTime =
                                                message.createdAt!;
                                            DateTime? previousTime = index > 0
                                                ? messages[index - 1].createdAt
                                                : null;

                                            // Check if a divider should be displayed for the current message
                                            bool displayDivider =
                                                shouldDisplayDivider(
                                                    previousTime, currentTime);

                                            // Build UI for message with divider if necessary
                                            return Column(
                                              children: [
                                                if (displayDivider) ...[
                                                  // Display divider with day and month
                                                  Container(
                                                    padding:
                                                        EdgeInsets.symmetric(
                                                            vertical: 8),
                                                    alignment: Alignment.center,
                                                    child: Text(
                                                      '${currentTime.day}/${currentTime.month}',
                                                      style: TextStyle(
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        color: Colors.grey,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                                // Build UI for message
                                                message.userSent ==
                                                        currentUser
                                                            .value!.userId
                                                    ? RightMessageUser(
                                                        message: message,
                                                      )
                                                    : LeftMessageUser(
                                                        userPhotoURL: widget
                                                            .otherUser.photoURL,
                                                        message: message),
                                              ],
                                            );
                                          }),
                                        );
                                      }),
                                )
                              : Padding(
                                  padding: EdgeInsets.all(10),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      Text(
                                        'Start a conversation about your requirements with ${widget.otherUser.username}',
                                        style: CustomTextStyles
                                            .labelLargeInterPrimary,
                                      )
                                    ],
                                  ),
                                ),
                        ),
                      ),
                    ),
                    Container(
                      margin: getMargin(top: 10),
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
                                borderDecoration:
                                    TextFormFieldStyleHelper.fillGray,
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
                                      if (controller.messageController.text !=
                                          '') {
                                        onTapSendIcon();
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
            ],
          ),
        ),
      ),
    );
  }

  /// Navigates to the signUpCreateAcountScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the signUpCreateAcountScreen.

  /// Navigates to the settingsScreen when the action is triggered.

  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the settingsScreen.
  onTapCancel() {
    Get.back();
  }

  onTapSendIcon() async {
    try {
      controller.isSending.value = true;
      if (widget.chatId != null) {
        await controller.sendMessage(widget.chatId!);
      } else {
        await controller.createChatAndSendMessage(widget.otherUser.userId!);
      }

      controller.isSending.value = false;
    } catch (e) {
      controller.isSending.value = false;

      print(e);
    }
  }
}
