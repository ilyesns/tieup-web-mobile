import 'package:flutter/material.dart';
import 'package:Tieup/core/app_export.dart';

class LoadingWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: CustomImageView(
        width: 85,
        height: 85,
        imagePath: ImageConstant.imgLoading,
      ),
    );
  }
}
