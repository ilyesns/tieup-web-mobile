import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:Tieup/core/app_export.dart';

class FilePickerService {
  static Future<File?> pickFile(
      {List<String> allowedExtensions = const [
        'pdf',
        'jpg',
        'jpeg',
        'png'
      ]}) async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: allowedExtensions,
    );

    if (result != null && result.files.isNotEmpty) {
      final path = result.files.first.path;
      final file = File(path!);

      return file;
    } else {
      Get.rawSnackbar(message: 'Upload just image or pdf file');
    }
  }
}
