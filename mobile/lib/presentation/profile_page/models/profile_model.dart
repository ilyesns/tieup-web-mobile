import 'package:get/get.dart';import 'chipviewskills_item_model.dart';import 'profile_item_model.dart';/// This class defines the variables used in the [profile_page],
/// and is typically used to hold data that is passed between different parts of the application.
class ProfileModel {Rx<List<ChipviewskillsItemModel>> chipviewskillsItemList = Rx(List.generate(8,(index) =>ChipviewskillsItemModel()));

Rx<List<ProfileItemModel>> profileItemList = Rx(List.generate(3,(index) => ProfileItemModel()));

 }
