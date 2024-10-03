import 'package:get/get.dart';
import 'package:Tieup/presentation/dashboard_page/controller/dashboard_controller.dart';

class DashboardBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => DashboardController());
  }
}
