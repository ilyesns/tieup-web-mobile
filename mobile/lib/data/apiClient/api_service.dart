import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:Tieup/data/apiClient/api_client.dart';
import 'dart:convert';

import 'package:Tieup/data/models/service/service.dart';

import '../models/offer/offer.dart';

class ApiService extends GetxService {
  Future<List<Service>> getAllServices() {
    return ApiClient().getAllServices();
  }

  Future<List<Offer>> getAllOffers() {
    return ApiClient().getAllOffers();
  }
}
