import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/order_page/controller/order_controller.dart';

class OrderBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => OrderController());
  }
}
