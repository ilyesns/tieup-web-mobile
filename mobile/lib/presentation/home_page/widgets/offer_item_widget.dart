import 'package:shimmer/shimmer.dart';
import 'package:Tieup/core/utils/validation_functions.dart';
import 'package:Tieup/data/models/offer/offer.dart';
import 'package:Tieup/data/models/service/service.dart';

import '../controller/home_controller.dart';
import '../models/home_item_model.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/widgets/custom_elevated_button.dart';
import 'package:Tieup/widgets/custom_icon_button.dart';

// ignore: must_be_immutable
class OfferItemWidget extends StatelessWidget {
  OfferItemWidget(
    this.offer, {
    Key? key,
  }) : super(
          key: key,
        );
  HomeController controller = Get.put(HomeController());

  Offer offer;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.center,
      child: InkWell(
        onTap: () => {Get.toNamed(AppRoutes.offerScreen, arguments: offer)},
        child: Container(
          decoration: AppDecoration.outlineIndigo.copyWith(
            borderRadius: BorderRadiusStyle.roundedBorder8,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              CustomImageView(
                width: getSize(120),
                height: getSize(100),
                url: offer.gallery!.images[0].url,
                fit: BoxFit.fill,
                radius: BorderRadiusStyle.roundedBorder8,
              ),
              Column(
                mainAxisSize: MainAxisSize.max,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.max,
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: getPadding(right: 9),
                        child: Text(
                          '${offer.extraData!.user!.username.toString().capitalizeFirstLetter()}',
                          style: theme.textTheme.labelLarge!.copyWith(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.w600),
                        ),
                      ),
                      SizedBox(
                        width: getHorizontalSize(6),
                      ),
                      Text(
                        '${offer.extraData!.freelancerProfile!.sellerLevel.toString().capitalizeFirstLetter()}',
                        style: theme.textTheme.labelLarge!
                            .copyWith(color: theme.colorScheme.secondary),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: getVerticalSize(15),
                  ),
                  Container(
                    width: 200,
                    child: Text(
                      offer.title!,
                      overflow: TextOverflow.clip,
                      maxLines: 2,
                      style: CustomTextStyles.labelLargeBluegray300,
                    ),
                  ),
                  Padding(
                    padding: getPadding(top: 9, right: 9),
                    child: Column(
                      mainAxisSize: MainAxisSize.max,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'from ${offer.basicPlan!.price!.ceil()}DT',
                          style: CustomTextStyles.labelLargeGray600_1,
                        ),
                      ],
                    ),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}

Widget buildShimmerLoading() {
  return Shimmer.fromColors(
    baseColor: Colors.grey[300]!,
    highlightColor: Colors.grey[100]!,
    child: Container(
      decoration: AppDecoration.outlineIndigo.copyWith(
        borderRadius: BorderRadiusStyle.roundedBorder8,
      ),
      child: Row(
        children: [
          Container(
            width: getSize(120),
            height: getSize(100),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8),
            ),
          ),
          Expanded(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    height: 20,
                    color: Colors.white,
                  ),
                  SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    height: 20,
                    color: Colors.white,
                  ),
                  SizedBox(height: 8),
                  Container(
                    width: 200, // Adjust width as needed
                    height: 20,
                    color: Colors.white,
                  ),
                  SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    height: 20,
                    color: Colors.white,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    ),
  );
}
