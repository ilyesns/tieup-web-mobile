import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:Tieup/firebase/base_user_provider.dart';
import 'package:Tieup/presentation/categories_screen/binding/categories_binding.dart';
import 'package:Tieup/presentation/change_password_screen/binding/change_password_binding.dart';
import 'package:Tieup/presentation/change_password_screen/change_password_screen.dart';
import 'package:Tieup/presentation/dashboard_page/binding/dashboard_binding.dart';
import 'package:Tieup/presentation/forget_password_screen/binding/forget_password_binding.dart';
import 'package:Tieup/presentation/forget_password_screen/forget_password_screen.dart';
import 'package:Tieup/presentation/home_page/bindings/home_binding.dart';
import 'package:Tieup/presentation/offer_screen/binding/offer_binding.dart';
import 'package:Tieup/presentation/offer_screen/offer_screen.dart';
import 'package:Tieup/presentation/order_page/binding/order_binding.dart';
import 'package:Tieup/presentation/splash_screen/splash_screen.dart';
import 'package:Tieup/presentation/splash_screen/binding/splash_binding.dart';
import 'package:Tieup/presentation/onboarding_one_screen/onboarding_one_screen.dart';
import 'package:Tieup/presentation/onboarding_one_screen/binding/onboarding_one_binding.dart';
import 'package:Tieup/presentation/onboarding_two_screen/onboarding_two_screen.dart';
import 'package:Tieup/presentation/onboarding_two_screen/binding/onboarding_two_binding.dart';
import 'package:Tieup/presentation/onboarding_three_screen/onboarding_three_screen.dart';
import 'package:Tieup/presentation/onboarding_three_screen/binding/onboarding_three_binding.dart';
import 'package:Tieup/presentation/sign_up_create_acount_screen/sign_up_create_acount_screen.dart';
import 'package:Tieup/presentation/sign_up_create_acount_screen/binding/sign_up_create_acount_binding.dart';
import 'package:Tieup/presentation/sign_up_complete_account_screen/sign_up_complete_account_screen.dart';
import 'package:Tieup/presentation/sign_up_complete_account_screen/binding/sign_up_complete_account_binding.dart';

import 'package:Tieup/presentation/login_screen/login_screen.dart';
import 'package:Tieup/presentation/login_screen/binding/login_binding.dart';

import 'package:Tieup/presentation/home_container_screen/home_container_screen.dart';
import 'package:Tieup/presentation/home_container_screen/binding/home_container_binding.dart';
import 'package:Tieup/presentation/search_screen/search_screen.dart';
import 'package:Tieup/presentation/search_screen/binding/search_binding.dart';

import 'package:Tieup/presentation/message_action_screen/message_action_screen.dart';
import 'package:Tieup/presentation/message_action_screen/binding/message_action_binding.dart';
import 'package:Tieup/presentation/chat_screen/chat_screen.dart';
import 'package:Tieup/presentation/chat_screen/binding/chat_binding.dart';

import 'package:Tieup/presentation/profile_screen/binding/profile_binding.dart';
import 'package:Tieup/presentation/personal_info_screen/personal_info_screen.dart';
import 'package:Tieup/presentation/personal_info_screen/binding/personal_info_binding.dart';

import 'package:get/get.dart';

class AppStateNotifier extends ChangeNotifier {
  AppStateNotifier._();

  static AppStateNotifier? _instance;
  static AppStateNotifier get instance => _instance ??= AppStateNotifier._();

  BaseAuthUser? initialUser;
  BaseAuthUser? user;
  bool showSplashImage = true;
  bool loading = true;

  /// Determines whether the app will refresh and build again when a sign
  /// in or sign out happens. This is useful when the app is launched or
  /// on an unexpected logout. However, this must be turned off when we
  /// intend to sign in/out and then navigate or perform any actions after.
  /// Otherwise, this will trigger a refresh and interrupt the action(s).
  bool notifyOnAuthChange = true;

  bool get loggedIn => user?.loggedIn ?? false;
  bool get initiallyLoggedIn => initialUser?.loggedIn ?? false;

  /// Mark as not needing to notify on a sign in / out when we intend
  /// to perform subsequent actions (such as navigation) afterwards.
  void updateNotifyOnAuthChange(bool notify) => notifyOnAuthChange = notify;

  void update(BaseAuthUser newUser) {
    final shouldUpdate =
        user?.uid == null || newUser.uid == null || user?.uid != newUser.uid;
    initialUser ??= newUser;
    user = newUser;
    // Refresh the app on auth change unless explicitly marked otherwise.
    // No need to update unless the user has changed.
    if (notifyOnAuthChange && shouldUpdate) {
      notifyListeners();
    }
    // Once again mark the notifier as needing to update on auth change
    // (in order to catch sign in / out events).
    updateNotifyOnAuthChange(true);
  }

  void stopShowingSplashImage() {
    showSplashImage = false;
    loading = false;

    notifyListeners();
  }
}

class AppRoutes {
  AppRoutes({required this.appStateNotifier});

  final AppStateNotifier appStateNotifier;
  get state => appStateNotifier;
  static const String splashScreen = '/splash_screen';

  static const String onboardingOneScreen = '/onboarding_one_screen';

  static const String onboardingTwoScreen = '/onboarding_two_screen';

  static const String onboardingThreeScreen = '/onboarding_three_screen';

  static const String signUpCreateAcountScreen =
      '/sign_up_create_acount_screen';

  static const String signUpCompleteAccountScreen =
      '/sign_up_complete_account_screen';

  static const String jobTypeScreen = '/job_type_screen';

  static const String speciallizationScreen = '/speciallization_screen';

  static const String selectACountryScreen = '/select_a_country_screen';

  static const String loginScreen = '/login_screen';

  static const String enterOtpScreen = '/enter_otp_screen';

  static const String homePage = '/home_page';

  static const String categoriesScreen = '/categories_screen';

  static const String homeContainerScreen = '/home_container_screen';

  static const String searchScreen = '/search_screen';

  static const String dashboardPage = '/dashboard_page';

  static const String jobDetailsPage = '/job_details_page';

  static const String jobDetailsTabContainerScreen =
      '/job_details_tab_container_screen';

  static const String messagePage = '/message_page';

  static const String messageActionScreen = '/message_action_screen';

  static const String chatScreen = '/chat_screen';

  static const String orderPage = '/saved_page';

  static const String savedDetailJobPage = '/saved_detail_job_page';

  static const String applyJobScreen = '/apply_job_screen';

  static const String appliedJobPage = '/applied_job_page';

  static const String notificationsGeneralPage = '/notifications_general_page';

  static const String notificationsMyProposalsPage =
      '/notifications_my_proposals_page';

  static const String notificationsMyProposalsTabContainerScreen =
      '/notifications_my_proposals_tab_container_screen';

  static const String profilePage = '/profile_page';
  static const String offerScreen = '/offer_screen';

  static const String personalInfoScreen = '/personal_info_screen';

  static const String experienceSettingScreen = '/experience_setting_screen';

  static const String newPositionScreen = '/new_position_screen';

  static const String addNewEducationScreen = '/add_new_education_screen';

  static const String privacyScreen = '/privacy_screen';
  static const String forgetPasswordScreen = '/forget_password_screen';
  static const String changePasswordScreen = '/change_password_screen';

  static const String languageScreen = '/language_screen';

  static const String notificationsScreen = '/notifications_screen';

  static const String appNavigationScreen = '/app_navigation_screen';

  static const String initialRoute = '/initialRoute';

  getPages() {
    return [
      GetPage(
        name: initialRoute,
        page: () => SplashScreen(appState: appStateNotifier),
        bindings: [
          SplashBinding(),
        ],
      ),
      GetPage(
        name: onboardingOneScreen,
        page: () => OnboardingOneScreen(),
        bindings: [
          OnboardingOneBinding(),
        ],
      ),
      GetPage(
        name: onboardingTwoScreen,
        page: () => OnboardingTwoScreen(),
        bindings: [
          OnboardingTwoBinding(),
        ],
      ),
      GetPage(
        name: onboardingThreeScreen,
        page: () => OnboardingThreeScreen(),
        bindings: [
          OnboardingThreeBinding(),
        ],
      ),
      GetPage(
        name: signUpCreateAcountScreen,
        page: () => SignUpCreateAcountScreen(),
        bindings: [
          SignUpCreateAcountBinding(),
        ],
      ),
      GetPage(
        name: signUpCompleteAccountScreen,
        page: () => SignUpCompleteAccountScreen(),
        bindings: [
          SignUpCompleteAccountBinding(),
        ],
      ),
      GetPage(
        name: loginScreen,
        page: () => LoginScreen(),
        bindings: [
          LoginBinding(),
        ],
      ),
      GetPage(
        name: offerScreen,
        page: () => OfferScreen(),
        bindings: [
          OfferBinding(),
        ],
      ),
      GetPage(
        name: homeContainerScreen,
        page: () => HomeContainerScreen(),
        bindings: [
          HomeContainerBinding(),
          HomeBinding(),
          ProfileBinding(),
          CategoriesBinding(),
          OrderBinding(),
          DashboardBinding()
        ],
      ),
      GetPage(
        name: searchScreen,
        page: () => SearchScreen(),
        bindings: [
          SearchBinding(),
        ],
      ),
      GetPage(
        name: messageActionScreen,
        page: () => MessageActionScreen(),
        bindings: [
          MessageActionBinding(),
        ],
      ),
      GetPage(
        name: chatScreen,
        page: () => ChatScreen(),
        bindings: [
          ChatBinding(),
        ],
      ),
      GetPage(
        name: personalInfoScreen,
        page: () => PersonalInfoScreen(),
        bindings: [
          PersonalInfoBinding(),
        ],
      ),
      GetPage(
        name: forgetPasswordScreen,
        page: () => ForgetPasswordScreen(),
        bindings: [
          ForgetPasswordBinding(),
        ],
      ),
      GetPage(
        name: changePasswordScreen,
        page: () => ChangePasswordScreen(),
        bindings: [
          ChangePasswordBinding(),
        ],
      ),
    ];
  }
}
