import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';

// ignore: must_be_immutable
class AppbarCircleimage extends StatelessWidget {
  AppbarCircleimage({
    Key? key,
    this.url,
    this.imagePath,
    this.svgPath,
    this.margin,
    this.onTap,
  }) : super(
          key: key,
        );

  String? imagePath;
  String? url;

  String? svgPath;

  EdgeInsetsGeometry? margin;

  Function? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadiusStyle.roundedBorder24,
      onTap: () {
        onTap?.call();
      },
      child: Padding(
        padding: margin ?? EdgeInsets.zero,
        child: CustomImageView(
          url: url,
          svgPath: svgPath,
          imagePath: imagePath,
          height: getSize(50),
          width: getSize(50),
          fit: BoxFit.cover,
          radius: BorderRadius.circular(
            getHorizontalSize(25),
          ),
        ),
      ),
    );
  }
}
