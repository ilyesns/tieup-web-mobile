import 'package:Tieup/core/app_export.dart';

class ExtraDataChat {
  String? userPhotoURL;
  String? username;

  ExtraDataChat({this.userPhotoURL, this.username});
  factory ExtraDataChat.fromJson(Map<String, dynamic> map) {
    return ExtraDataChat(
        userPhotoURL: map['otherUserPhotoUrl'], username: map['otherUserName']);
  }
}

class Chat {
  String? chatId;
  List<String>? users;
  String? sender;
  String? recipient;
  String? lastMessage;
  String? lastMessageSentBy;
  List<dynamic>? lastMessageSeenBy;
  DateTime? lastMessageTime;
  String? senderName;
  String? recipientName;
  ExtraDataChat? extraData;

  Chat(
      {this.chatId,
      this.users,
      this.sender,
      this.recipient,
      this.lastMessage,
      this.lastMessageSentBy,
      this.lastMessageSeenBy,
      this.lastMessageTime,
      this.senderName,
      this.recipientName,
      this.extraData});

  // Factory method to create a Chat instance from a Map
  factory Chat.fromMap(Map<String, dynamic> map) {
    return Chat(
        chatId: map['chatId'] ?? '',
        users: (map['users'] as List<dynamic>?)
            ?.map((ref) => ref as String)
            .toList(),
        sender: map['sender'] as String?,
        recipient: map['recipient'] as String?,
        lastMessage: map['lastMessage'] ?? '',
        lastMessageSentBy: map['lastMessageSentBy'] as String?,
        lastMessageSeenBy: (map['lastMessageSeenBy']! as List<dynamic>?),
        lastMessageTime: parseFirestoreTimestamp(map['lastMessageTime']),
        senderName: map['senderName'] ?? '',
        recipientName: map['recipientName'] ?? '',
        extraData: ExtraDataChat.fromJson(map));
  }

  // Method to convert Chat instance to a Map
  Map<String, dynamic> toMap() {
    return {
      'chatId': chatId,
      'users': users,
      'sender': sender,
      'recipient': recipient,
      'lastMessage': lastMessage,
      'lastMessageSentBy': lastMessageSentBy,
      'lastMessageSeenBy': lastMessageSeenBy,
      'lastMessageTime': lastMessageTime,
      'senderName': senderName,
      'recipientName': recipientName,
    };
  }
}
