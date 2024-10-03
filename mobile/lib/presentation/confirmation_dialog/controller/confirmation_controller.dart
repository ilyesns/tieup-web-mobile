import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/presentation/confirmation_dialog/models/confirmation_model.dart';

/// A controller class for the ConfirmationDialog.
///
/// This class manages the state of the ConfirmationDialog, including the
/// current confirmationModelObj
class ConfirmationController extends GetxController {
  confirmAgreement(bool response) async {
    final prefUtils = PrefUtils();
    await prefUtils.setAgreementPolicyData(response);
  }
}
