import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/firebase/auth_util.dart';

import '../controller/message_controller.dart';
import '../models/message_item_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';

// ignore: must_be_immutable
class MessageItemWidget extends StatelessWidget {
  MessageItemWidget(
    this.chat, {
    Key? key,
  }) : super(
          key: key,
        );

  Chat chat;

  var controller = Get.find<MessageController>();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: getVerticalSize(73),
      width: MediaQuery.of(context).size.width,
      child: Align(
        alignment: Alignment.topCenter,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          mainAxisSize: MainAxisSize.max,
          children: [
            Row(
              children: [
                SizedBox(
                  height: getSize(56),
                  width: getSize(56),
                  child: chat.extraData!.userPhotoURL != null
                      ? CustomImageView(
                          url: chat.extraData!.userPhotoURL,
                          height: getSize(56),
                          fit: BoxFit.cover,
                          width: getSize(56),
                          radius: BorderRadius.circular(
                            getHorizontalSize(28),
                          ),
                          alignment: Alignment.center,
                        )
                      : CustomImageView(
                          imagePath: ImageConstant.imgAvatar,
                          height: getSize(56),
                          fit: BoxFit.cover,
                          width: getSize(56),
                          radius: BorderRadius.circular(
                            getHorizontalSize(28),
                          ),
                          alignment: Alignment.center,
                        ),
                ),
                Padding(
                  padding: getPadding(
                    left: 12,
                    top: 3,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text(
                        chat.extraData!.username!,
                        style: CustomTextStyles.titleMedium15,
                      ),
                      Padding(
                        padding: getPadding(
                          top: 9,
                        ),
                        child: Container(
                          width: mediaQueryData.size.width -
                              getHorizontalSize(270),
                          child: userExistsInList(currentUser.value!.userId!,
                                  chat.lastMessageSeenBy!)
                              ? Text(
                                  chat.lastMessage!.capitalizeFirstLetter(),
                                  overflow: TextOverflow.ellipsis,
                                  style: CustomTextStyles.labelLargeBluegray300,
                                )
                              : Text(
                                  chat.lastMessage!.capitalizeFirstLetter(),
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold),
                                ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            Padding(
              padding: getPadding(
                left: 30,
                top: 7,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text(
                    formatDate(chat.lastMessageTime!),
                    style: CustomTextStyles.labelLargeSemiBold,
                  ),
                  if (!userExistsInList(
                      currentUser.value!.userId!, chat.lastMessageSeenBy!))
                    Container(
                      margin: getMargin(
                        top: 6,
                      ),
                      padding: getPadding(
                        left: 5,
                        top: 5,
                        right: 5,
                        bottom: 5,
                      ),
                      decoration: AppDecoration.fillPrimary.copyWith(
                        borderRadius: BorderRadiusStyle.circleBorder12,
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
