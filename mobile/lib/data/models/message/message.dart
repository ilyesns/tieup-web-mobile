import 'package:Tieup/core/app_export.dart';
import 'package:Tieup/core/utils/enum.dart';

class Message {
  String? messageId;
  String? userSent;
  String? text;
  Media? imageUrl;
  Media? fileUrl;
  bool? approved;
  MessageStatus? messageStatus;
  String? chatId;
  DateTime? createdAt;
  String? documentRef;

  Message({
    this.messageId,
    this.userSent,
    this.text,
    this.imageUrl,
    this.fileUrl,
    this.approved,
    this.messageStatus,
    this.chatId,
    this.createdAt,
    this.documentRef,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      messageId: json['messageId'],
      userSent: json['userSent'],
      text: json['text'],
      imageUrl:
          json['imageUrl'] != null ? Media.fromJson(json['imageUrl']) : null,
      fileUrl: json['fileUrl'] != null ? Media.fromJson(json['fileUrl']) : null,
      approved: json['approved'],
      messageStatus: json['messageStatus'] != null
          ? _parseMessageStatus(json['messageStatus'])
          : null,
      chatId: json['chatId'],
      createdAt: json['createdAt'] != null
          ? parseFirestoreTimestamp(json['createdAt'])
          : null,
      documentRef: json['documentRef'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'messageId': messageId,
      'userSent': userSent,
      'text': text,
      'imageUrl': imageUrl?.toJson(),
      'fileUrl': fileUrl?.toJson(),
      'approved': approved,
      'chatId': chatId,
      'createdAt': createdAt?.toIso8601String(),
      'documentRef': documentRef,
    };
  }

  static MessageStatus? _parseMessageStatus(String? status) {
    switch (status) {
      case 'accepted':
        return MessageStatus.accepted;
      case 'pending':
        return MessageStatus.pending;
      case 'rejected':
        return MessageStatus.rejected;
      default:
        return null;
    }
  }
}

class Media {
  final int size;
  final String name;
  final String type;
  final String url;

  Media({
    required this.size,
    required this.name,
    required this.type,
    required this.url,
  });

  factory Media.fromJson(Map<String, dynamic> json) {
    return Media(
      url: json['url'],
      type: json['type'],
      name: json['name'],
      size: json['size'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'url': url,
      'size': size,
    };
  }
}
