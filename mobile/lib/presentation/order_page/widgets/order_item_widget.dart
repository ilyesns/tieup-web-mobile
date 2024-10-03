import 'package:Tieup/core/utils/enum.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/presentation/order_page/models/order_model.dart';

import '../controller/order_controller.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';

// ignore: must_be_immutable
class OrderItemWidget extends StatelessWidget {
  OrderItemWidget({
    Key? key,
    required this.order,
  }) : super(
          key: key,
        );
  Order order;
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: getPadding(
        all: 10,
      ),
      decoration: AppDecoration.outlineIndigo.copyWith(
        borderRadius: BorderRadiusStyle.roundedBorder16,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CustomIconButton(
            height: getSize(48),
            width: getSize(48),
            margin: getMargin(
              bottom: 68,
            ),
            padding: getPadding(
              all: 8,
            ),
            child: CustomImageView(
              svgPath: ImageConstant.imgInbox,
            ),
          ),
          Padding(
            padding: getPadding(
              left: 12,
              top: 4,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Text(
                  order.orderId!,
                  style: CustomTextStyles.titleMedium15,
                ),
                if (order.clientUserName != null)
                  Padding(
                    padding: getPadding(
                      top: 10,
                    ),
                    child: Text(
                      "Ordered by ${order.clientUserName} ".tr,
                      style: CustomTextStyles.labelLargeGray600_1,
                    ),
                  ),
                Padding(
                  padding: getPadding(
                    top: 10,
                  ),
                  child: Text(
                    "Price ${order.basePrice!.toInt()} DT".tr,
                    style: CustomTextStyles.labelLargeGray600_1,
                  ),
                ),
                Padding(
                  padding: getPadding(
                    top: 13,
                  ),
                  child: Row(
                    children: [
                      CustomElevatedButton(
                        height: getVerticalSize(28),
                        width: getHorizontalSize(100),
                        text: "${formatDate(order.createdDate!)}".tr,
                        buttonTextStyle: theme.textTheme.labelLarge!,
                      ),
                      Container(
                        margin: getMargin(left: 10),
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.all(Radius.circular(10)),
                            color: order.status == OrderStatus.pending
                                ? Colors.yellow
                                : order.status == OrderStatus.inProgress
                                    ? Colors.greenAccent
                                    : order.status == OrderStatus.completed
                                        ? theme.colorScheme.primary
                                        : order.status == OrderStatus.delivered
                                            ? Colors.green
                                            : order.status ==
                                                    OrderStatus.cancelled
                                                ? theme.colorScheme.secondary
                                                : Colors.grey),
                        height: getVerticalSize(28),
                        width: getHorizontalSize(103),
                        child: Center(
                          child: Text(
                            "${OrderStatus.values.firstWhere((element) => order.status == element).name.toUpperCase()}",
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
