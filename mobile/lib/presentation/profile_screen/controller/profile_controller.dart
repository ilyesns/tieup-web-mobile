import 'dart:io';

import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/progress_dialog_utils.dart';
import 'package:Tieup/data/apiClient/api_client.dart';
import 'package:Tieup/firebase/auth_util.dart';
import 'package:Tieup/presentation/profile_screen/models/settings_model.dart';

/// A controller class for the SettingsScreen.
///
/// This class manages the state of the SettingsScreen, including the
/// current settingsModelObj
class ProfileController extends GetxController {
  Rx<File?> image = Rx<File?>(null);
  RxBool isLoading = false.obs;

  uploadUserPhoto() async {
    try {
      isLoading.value = true;
      await ApiClient()
          .uploadPhoto(currentUid.value!, currentJwtToken.value!, image.value);
      await fetchUserData(currentJwtToken.value!, currentUid.value!);
      isLoading.value = false;
      image.value = null;
    } catch (e) {
      isLoading.value = false;

      print(e);
    }
  }

  switchMode() async {
    try {
      var res = await ApiClient()
          .switchRole(currentUid.value!, currentJwtToken.value!);
      var res1 = await fetchUserData(currentJwtToken.value!, currentUid.value!);
    } catch (e) {
      isLoading.value = false;

      print(e);
    }
  }
}
