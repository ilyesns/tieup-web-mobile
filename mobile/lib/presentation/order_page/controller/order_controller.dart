import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/enum.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/order_page/models/order_model.dart';

/// A controller class for the SavedPage.
///
/// This class manages the state of the SavedPage, including the
/// current savedModelObj
class OrderController extends GetxController {
  RxList<Order> orders = RxList<Order>([]);
  RxBool isLoading = false.obs;
  RxBool isError = false.obs;
  final appState = AppStateNotifier.instance;

  fetchOrders() async {
    try {
      isLoading.value = true;
      List<Order> result = [];
      if (currentUser.value!.role == Role.client) {
        result = await ApiClient()
            .getOrders(currentUid.value!, currentJwtToken.value!);
      } else {
        result = await ApiClient()
            .getOrdersFreelancer(currentUid.value!, currentJwtToken.value!);
      }
      orders.assignAll(result);
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;
      isError.value = true;
      Get.rawSnackbar(message: 'Something went wrong!Please refresh the page');
    }
  }

  @override
  void onInit() {
    // TODO: implement onInit
    super.onInit();
    if (appState.loggedIn) fetchOrders();
  }
}
