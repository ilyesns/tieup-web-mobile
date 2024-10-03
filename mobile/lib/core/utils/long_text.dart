import 'package:flutter/material.dart';

class LongText extends StatefulWidget {
  final String text;

  const LongText({Key? key, required this.text}) : super(key: key);

  @override
  _LongTextState createState() => _LongTextState();
}

class _LongTextState extends State<LongText> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    final length = widget.text.length;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _isExpanded
            ? Text(
                widget.text,
                style:
                    TextStyle(fontSize: 15), // Customize text style as needed
              )
            : Text(
                widget.text,
                style:
                    TextStyle(fontSize: 15), // Customize text style as needed
                maxLines: 2, // Set maxLines to null if expanded
                overflow: TextOverflow.ellipsis,
              ),
        if (length > 70)
          TextButton(
            onPressed: () {
              setState(() {
                _isExpanded = !_isExpanded;
              });
            },
            child: Text('More'),
          ),
      ],
    );
  }
}
