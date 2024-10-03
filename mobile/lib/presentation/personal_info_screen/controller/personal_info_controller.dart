import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/personal_info_screen/models/personal_info_model.dart';

/// A controller class for the PersonalInfoScreen.
///
/// This class manages the state of the PersonalInfoScreen, including the
/// current personalInfoModelObj
class PersonalInfoController extends GetxController {
  Rx<PersonalInfoModel> personalInfoModelObj = PersonalInfoModel().obs;

  @override
  void onClose() {
    super.onClose();
  }
}
