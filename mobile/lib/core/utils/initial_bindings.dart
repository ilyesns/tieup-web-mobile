import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/data/apiClient/api_service.dart';
import 'package:Tieup/firebase/firebase_user_provider.dart';

class InitialBindings extends Bindings {
  @override
  void dependencies() {
    Get.put(PrefUtils());
    Get.put(ApiClient());
    Get.lazyPut<ApiService>(() => ApiService());
    Connectivity connectivity = Connectivity();
    Get.put(NetworkInfo(connectivity));
  }
}
