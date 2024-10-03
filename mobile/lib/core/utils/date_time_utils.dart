import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';

const String dateTimeFormatPattern = 'dd/MM/yyyy';

extension DateTimeExtension on DateTime {
  /// Return a string representing [date] formatted according to our locale
  String format([
    String pattern = dateTimeFormatPattern,
    String? locale,
  ]) {
    if (locale != null && locale.isNotEmpty) {
      initializeDateFormatting(locale);
    }
    return DateFormat(pattern, locale).format(this);
  }
}

String formatTime(DateTime time) {
  String hour = time.hour.toString().padLeft(2, '0');
  String minute = time.minute.toString().padLeft(2, '0');
  return '$hour:$minute';
}

DateTime? parseFirestoreTimestamp(dynamic timestamp) {
  if (timestamp is Map<String, dynamic> &&
      timestamp.containsKey('_seconds') &&
      timestamp.containsKey('_nanoseconds')) {
    // Parse Firestore timestamp from map
    return DateTime.fromMillisecondsSinceEpoch(
      (timestamp['_seconds'] as int) * 1000 +
          (timestamp['_nanoseconds'] as int) ~/ 1000000,
      isUtc: true,
    );
  } else if (timestamp is String) {
    // Parse Firestore timestamp from string
    try {
      return DateTime.parse(timestamp).toUtc();
    } catch (e) {
      print("Error parsing Firestore timestamp string: $e");
      return null;
    }
  } else {
    // Return null for unsupported format
    return null;
  }
}
