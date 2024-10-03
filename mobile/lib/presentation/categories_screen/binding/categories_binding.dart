import 'package:get/get.dart';
import 'package:Tieup/presentation/categories_screen/controller/categories_controller.dart';

/// A binding class for the HomeContainerScreen.
///
/// This class ensures that the HomeContainerController is created when the
/// HomeContainerScreen is first loaded.
class CategoriesBinding extends Bindings {
  @override
  void dependencies() {
    Get.lazyPut(() => CategoriesController());
  }
}
