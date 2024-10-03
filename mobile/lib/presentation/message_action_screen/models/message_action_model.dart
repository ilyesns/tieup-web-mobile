import 'package:get/get.dart';import 'message_action_item_model.dart';/// This class defines the variables used in the [message_action_screen],
/// and is typically used to hold data that is passed between different parts of the application.
class MessageActionModel {Rx<List<MessageActionItemModel>> messageActionItemList = Rx(List.generate(4,(index) => MessageActionItemModel()));

 }
