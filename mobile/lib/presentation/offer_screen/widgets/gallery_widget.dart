import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:Tieup/core/app_export.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';

import '../../../data/models/offer/offer.dart';

class GalleryWidget extends StatelessWidget {
  final List<GalleryItem?> items;

  GalleryWidget({required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
        width: MediaQuery.sizeOf(context).width,
        height: 300,
        child: CarouselSlider.builder(
          itemCount: items.length,
          itemBuilder: (BuildContext context, int index, int realIndex) {
            if (items[index]!.type.toString().contains('image')) {
              return CustomImageView(
                width: double.maxFinite,
                height: 300,
                url: items[index]!.url,
                fit: BoxFit.cover,
              );
            } else if (items[index]!.type.contains('video')) {
              return VideoSlider(videoUrl: items[index]!.url);
            } else {
              return SizedBox
                  .shrink(); // Placeholder for unsupported media types
            }
          },
          options: CarouselOptions(
            height: 300.0,
            viewportFraction: 1,
            enlargeCenterPage: true,
            aspectRatio: 16 / 9,
            enableInfiniteScroll: false,
            onPageChanged: (index, reason) {
              // Handle page change
            },
          ),
        ));
  }
}

class VideoSlider extends StatefulWidget {
  final String videoUrl;

  VideoSlider({required this.videoUrl});

  @override
  _VideoSliderState createState() => _VideoSliderState();
}

class _VideoSliderState extends State<VideoSlider> {
  late ChewieController _chewieController;

  @override
  void initState() {
    super.initState();
    _chewieController = ChewieController(
      videoPlayerController: VideoPlayerController.network(widget.videoUrl),
      autoPlay: true,
      looping: true,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Chewie(
      controller: _chewieController,
    );
  }

  @override
  void dispose() {
    super.dispose();
    _chewieController.dispose();
  }
}
