import 'package:get/get_instance/src/bindings_interface.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/offer_screen/controller/offer_controller.dart';

class OfferBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => OfferController());
  }
}
