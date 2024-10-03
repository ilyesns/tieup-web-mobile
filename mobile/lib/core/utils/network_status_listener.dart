import 'dart:async';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:Tieup/core/app_export.dart';

class NetworkStatusListener extends StatefulWidget {
  const NetworkStatusListener({Key? key}) : super(key: key);

  @override
  _NetworkStatusListenerState createState() => _NetworkStatusListenerState();
}

class _NetworkStatusListenerState extends State<NetworkStatusListener> {
  final Connectivity _connectivity = Connectivity();
  late StreamSubscription<ConnectivityResult> _connectivitySubscription;

  @override
  void initState() {
    super.initState();
    _connectivitySubscription =
        _connectivity.onConnectivityChanged.listen(_updateConnectionStatus);
  }

  @override
  void dispose() {
    _connectivitySubscription.cancel();
    super.dispose();
  }

  void _updateConnectionStatus(ConnectivityResult result) {
    if (result == ConnectivityResult.none) {
      // Show a popup when the network goes offline
      Get.rawSnackbar(message: 'No Internet Connection');
    }
  }

  @override
  Widget build(BuildContext context) {
    // You can return an empty container here, as this widget doesn't have any UI
    return Container();
  }
}
