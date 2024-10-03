import 'package:get/get.dart';import 'message_item_model.dart';/// This class defines the variables used in the [message_page],
/// and is typically used to hold data that is passed between different parts of the application.
class MessageModel {Rx<List<MessageItemModel>> messageItemList = Rx(List.generate(4,(index) => MessageItemModel()));

 }
