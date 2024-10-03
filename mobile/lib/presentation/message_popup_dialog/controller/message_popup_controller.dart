import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/logout_popup_dialog/models/logout_popup_model.dart';

/// A controller class for the LogoutPopupDialog.
///
/// This class manages the state of the LogoutPopupDialog, including the
/// current logoutPopupModelObj
class LogoutPopupController extends GetxController {
  Rx<LogoutPopupModel> logoutPopupModelObj = LogoutPopupModel().obs;
}
