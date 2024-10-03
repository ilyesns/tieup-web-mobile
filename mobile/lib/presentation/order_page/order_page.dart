import 'package:Tieup/presentation/order_page/widgets/order_item_widget.dart';
import 'package:Tieup/widgets/loading_widget.dart';
import 'controller/order_controller.dart';
import 'models/order_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/app_bar/appbar_image.dart';
import 'package:Tieup/widgets/app_bar/appbar_title.dart';
import 'package:Tieup/widgets/app_bar/custom_app_bar.dart';

// ignore_for_file: must_be_immutable
class OrderPage extends StatelessWidget {
  OrderPage({Key? key}) : super(key: key);

  OrderController controller = Get.put(OrderController());
  final appStateNotifer = AppStateNotifier.instance;

  @override
  Widget build(BuildContext context) {
    mediaQueryData = MediaQuery.of(context);
    return SafeArea(
        child: Scaffold(
            backgroundColor: appTheme.whiteA70001,
            appBar: CustomAppBar(
                leadingWidth: getHorizontalSize(48),
                centerTitle: true,
                title: AppbarTitle(text: "My Order")),
            body: RefreshIndicator(
              onRefresh: () async {
                await controller.fetchOrders();
              },
              child: !appStateNotifer.loggedIn
                  ? Container(
                      padding: getPadding(all: 24),
                      width: double.maxFinite,
                      height: double.maxFinite,
                      child: Center(
                          child: Text(
                        "Unlock the full order experience! Sign up now to gain access.",
                        style: CustomTextStyles.titleMedium15,
                        textAlign: TextAlign.center,
                      )),
                    )
                  : SingleChildScrollView(
                      child: Container(
                          width: mediaQueryData.size.width,
                          height: mediaQueryData.size.height,
                          padding: getPadding(left: 24, right: 24),
                          child: Column(
                              mainAxisAlignment: MainAxisAlignment.start,
                              mainAxisSize: MainAxisSize.max,
                              children: [
                                Obx(
                                  () => controller.isError.isTrue
                                      ? Expanded(
                                          child: Container(
                                            padding: getPadding(top: 30),
                                            child:
                                                Text("Something went wrong!"),
                                          ),
                                        )
                                      : controller.isLoading.isTrue
                                          ? Container(
                                              height: 600,
                                              child: Center(
                                                  child: LoadingWidget()))
                                          : controller.orders.length == 0
                                              ? Expanded(
                                                  child: Padding(
                                                      padding:
                                                          getPadding(top: 30),
                                                      child: Center(
                                                        child: Text(
                                                          "You do not have any orders yet!",
                                                          style: CustomTextStyles
                                                              .titleMedium15,
                                                        ),
                                                      )),
                                                )
                                              : Expanded(
                                                  child: Padding(
                                                    padding:
                                                        getPadding(top: 30),
                                                    child: ListView.separated(
                                                      physics:
                                                          BouncingScrollPhysics(),
                                                      shrinkWrap: true,
                                                      separatorBuilder:
                                                          (context, index) {
                                                        return SizedBox(
                                                            height:
                                                                getVerticalSize(
                                                                    12));
                                                      },
                                                      itemCount: controller
                                                          .orders.length,
                                                      itemBuilder:
                                                          (context, index) {
                                                        final Order order =
                                                            controller
                                                                .orders[index];
                                                        return OrderItemWidget(
                                                            order: order);
                                                      },
                                                    ),
                                                  ),
                                                ),
                                ),
                              ])),
                    ),
            )));
  }

  /// Navigates to the previous screen.
  ///
  /// When the action is triggered, this function uses the [Get] package to
  /// navigate to the previous screen in the navigation stack.
  onTapArrowbackone() {
    Get.back();
  }
}
