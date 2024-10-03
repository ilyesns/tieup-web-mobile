import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/dashboard_page/model/freelancer_profile.dart';
import 'package:Tieup/presentation/dashboard_page/model/wallet.dart';

class DashboardController extends GetxController {
  Rx<FreelancerProfileStatistics?> profile =
      Rx<FreelancerProfileStatistics?>(null);
  Rx<Wallet?> wallet = Rx<Wallet?>(null);

  RxBool isLoading = false.obs;
  RxBool isLoading2 = false.obs;

  Future fetchFreelancerProfileS() async {
    try {
      isLoading.value = true;
      profile.value = await ApiClient().getFreelancerProfileStatistic(
          currentUid.value!, currentJwtToken.value!);
      isLoading.value = false;
    } catch (e) {
      isLoading.value = false;

      print(e);
    }
  }

  Future fetchFreelancerWallet() async {
    try {
      isLoading2.value = true;
      wallet.value = await ApiClient()
          .getWallet(currentUid.value!, currentJwtToken.value!);
      isLoading2.value = false;
    } catch (e) {
      isLoading2.value = false;

      print(e);
    }
  }

  @override
  void onInit() {
    // TODO: implement onInit
    super.onInit();
    fetchFreelancerProfileS();
    fetchFreelancerWallet();
  }
}
