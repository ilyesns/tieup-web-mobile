import 'package:Tieup/data/models/chat/chat_model.dart';
import 'package:Tieup/presentation/delete_chat_popup_dialog/delete_chat_popup_dialog.dart';
import 'package:Tieup/presentation/home_container_screen/controller/home_container_controller.dart';
import 'package:Tieup/widgets/loading_widget.dart';

import '../message_page/widgets/message_item_widget.dart';
import 'controller/message_controller.dart';
import 'models/message_item_model.dart';
import 'models/message_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_search_view.dart';

// ignore_for_file: must_be_immutable
class MessagePage extends StatelessWidget {
  MessagePage({Key? key}) : super(key: key);

  MessageController controller = Get.put(MessageController());
  HomeContainerController homeController = Get.put(HomeContainerController());
  final appStateNotifer = AppStateNotifier.instance;

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
            centerTitle: true,
            title: AppbarTitle(text: "lbl_message".tr)),
        body: !appStateNotifer.loggedIn
            ? Container(
                padding: getPadding(all: 24),
                width: double.maxFinite,
                height: double.maxFinite,
                child: Center(
                    child: Text(
                  "Unlock the full messaging experience! Sign up now to gain access.",
                  style: CustomTextStyles.titleMedium15,
                  textAlign: TextAlign.center,
                )),
              )
            : RefreshIndicator(
                onRefresh: () async {
                  await homeController.fetchChats();
                  homeController.initChatsStream();
                },
                child: Container(
                  width: double.maxFinite,
                  padding: getPadding(all: 24),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        CustomSearchView(
                            autofocus: false,
                            focusNode: controller.textFieldFocus,
                            onEditingComplete: () {
                              controller.searchChat();
                              controller.textFieldFocus.unfocus();
                            },
                            margin: getMargin(top: 4),
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
                              child: IconButton(
                                onPressed: () {
                                  controller.searchController.clear();
                                  controller.isSearching.value = false;
                                  controller.chats.value = [];
                                  controller.textFieldFocus.unfocus();
                                },
                                icon: Icon(
                                  Icons.clear,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ),
                            suffixConstraints:
                                BoxConstraints(maxHeight: getVerticalSize(52)),
                            contentPadding: getPadding(top: 12, bottom: 12)),
                        Obx(
                          () => homeController.isErrorChat.isTrue
                              ? Container(
                                  width: mediaQueryData.size.width,
                                  height: 700,
                                  child: Center(
                                      child: Text('Something went wrong! ')))
                              : controller.isSearching.isTrue
                                  ? controller.isLoading.isTrue
                                      ? Center(
                                          child: Container(
                                              width: mediaQueryData.size.width,
                                              height: 700,
                                              child: LoadingWidget()))
                                      : controller.chats.length == 0
                                          ? Container(
                                              width: mediaQueryData.size.width,
                                              height: 700,
                                              child: Center(
                                                child: Text(
                                                    'No result for this term ${controller.searchController.text}'),
                                              ),
                                            )
                                          : Padding(
                                              padding: const EdgeInsets.only(
                                                  top: 10, bottom: 40),
                                              child: RefreshIndicator(
                                                onRefresh: onRefresh,
                                                child: Container(
                                                    width: mediaQueryData
                                                        .size.width,
                                                    height: 700,
                                                    child: ListView.builder(
                                                        itemCount: controller
                                                            .chats.length,
                                                        itemBuilder:
                                                            (_, index) {
                                                          Chat chat =
                                                              homeController
                                                                  .chats[index];

                                                          return InkWell(
                                                            onLongPress: () {
                                                              onLongPress(
                                                                  chat.chatId!);
                                                            },
                                                            onTap: () {
                                                              onTapRowesther(
                                                                  chat);
                                                              controller
                                                                  .markUserReader(
                                                                      chat.chatId!);
                                                            },
                                                            child:
                                                                MessageItemWidget(
                                                              chat,
                                                            ),
                                                          );
                                                        })),
                                              ),
                                            )
                                  : Padding(
                                      padding: const EdgeInsets.only(
                                          top: 10, bottom: 40),
                                      child: RefreshIndicator(
                                        onRefresh: onRefresh,
                                        child: Container(
                                          width: mediaQueryData.size.width,
                                          height: 700,
                                          child: StreamBuilder<List<Chat>>(
                                            initialData: homeController.chats,
                                            stream: homeController.chatsStream,
                                            builder: (context, snapshot) {
                                              if (!snapshot.hasData) {
                                                return LoadingWidget();
                                              }
                                              if (snapshot
                                                  .requireData.isEmpty) {
                                                return Center(
                                                  child: Container(
                                                    child: Text(
                                                      'Start a conversation to get things going!',
                                                      style: CustomTextStyles
                                                          .titleMedium15,
                                                    ),
                                                  ),
                                                );
                                              }
                                              return Obx(() => ListView.builder(
                                                  itemCount: homeController
                                                      .chats.length,
                                                  itemBuilder: (_, index) {
                                                    Chat chat = homeController
                                                        .chats[index];

                                                    return GestureDetector(
                                                      onLongPress: () {
                                                        onLongPress(
                                                            chat.chatId!);
                                                      },
                                                      onTap: () {
                                                        onTapRowesther(chat);
                                                        controller
                                                            .markUserReader(
                                                                chat.chatId!);
                                                      },
                                                      child: MessageItemWidget(
                                                        chat,
                                                      ),
                                                    );
                                                  }));
                                            },
                                          ),
                                        ),
                                      ),
                                    ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
      ),
    );
  }

  Future<void> onRefresh() async {
    homeController.initChatsStream();
  }

  /// Navigates to the chatScreen when the action is triggered.
  /// When the action is triggered, this function uses the [Get] package to
  /// push the named route for the chatScreen.
  onTapRowesther(chat) {
    Get.toNamed(AppRoutes.chatScreen, arguments: chat);
  }

  onLongPress(String chatId) {
    Get.dialog(AlertDialog(
        backgroundColor: Colors.transparent,
        contentPadding: EdgeInsets.zero,
        insetPadding: const EdgeInsets.only(left: 0),
        content: DeleteChatPopupDialog(chatId: chatId)));
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapArrowbackone() {
    Get.back();
  }
}
