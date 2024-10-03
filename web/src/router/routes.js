import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  createRoutesFromElements,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { LandingPage } from "../pages/landing";
import { HomePage } from "../pages/Home";
import SignUp from "../pages/Signup";
import LogIn from "../pages/Login";
import NotFoundPage from "../pages/NotFoundPage";
import { SubServicesPage } from "../pages/SubServices";
import { ServicesPage } from "../pages/Services";
import { ProtectedRoute } from "./protected_route";
import axios from "axios";
import { BASE_URL } from "../util";
import { useAuth } from "../hooks/auth_context";
import { OffersPage } from "../pages/offer_pages/Offers";
import { OfferPage } from "../pages/offer_pages/Offer";
import { ProfilePage } from "../pages/Profile";
import { EditProfilePage } from "../pages/EditProfile";
import { BecomeSellerPage } from "../pages/BecomeSeller";
import { PersonalInfoPage } from "../pages/PersonalInfo";
import { DashboardPage } from "../pages/Dashboard";
import { ManageOffer } from "../pages/offer_pages/ManageOffers";
import { CreateOffer } from "../pages/offer_pages/CreateOffer";
import { EditOffer } from "../pages/offer_pages/EditOffer";
import { ManageOrder } from "../pages/order_pages/ManageOrder";
import { ChatPage } from "../pages/Chat";
import { FreelancerProfilePage } from "../pages/FreelancerProfile";
import { PaymentSuccess } from "../pages/PaymentSuccess";
import { Order, Orders } from "../pages/order_pages/Order";
import { PrivateRoute } from "./private_routes";
import LoadingPage from "../components/Loading";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { SearchPage } from "../pages/SearchPage";
import { EarningsPage } from "../pages/Earnings";
import ForgetPassword from "../pages/ForgetPassword";

function SmoothScroll({ children }) {
  const location = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType !== "POP") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [location]);
  return <>{children}</>;
}

const RedirectToHome = ({ path }) => {
  const { isLoggedIn, userRole, isLoading } = useAuth();

  if (isLoading) return <LoadingPage />;

  return isLoggedIn && userRole === "freelancer" ? (
    <Navigate to="/dashboard" replace />
  ) : isLoggedIn && userRole === "client" ? (
    <Navigate to="/home" replace />
  ) : (
    <LandingPage />
  );
};
const CustomRoute = ({ path, element }) => {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? <Navigate to="/home" replace /> : element;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RedirectToHome path={"/"} />,
  },
  {
    path: "/home",
    element: (
      <SmoothScroll>
        <HomePage />
      </SmoothScroll>
    ),
  },
  {
    path: "/payment-success",
    element: <PaymentSuccess />,
  },

  {
    path: "/signup",
    element: <CustomRoute path="/signup" element={<SignUp />} />,
  },
  {
    path: "/login",
    element: <CustomRoute path="/login" element={<LogIn />} />,
  },
  {
    path: "/forget-password",
    element: <CustomRoute path="/login" element={<ForgetPassword />} />,
  },
  {
    path: "/services",
    element: (
      <SmoothScroll>
        <ServicesPage />
      </SmoothScroll>
    ),
  },

  {
    path: "/subservices/:serviceId",
    element: (
      <SmoothScroll>
        <SubServicesPage />
      </SmoothScroll>
    ),
  },
  {
    path: "/subservices/:serviceId/offers/:subServiceId",
    element: (
      <SmoothScroll>
        <OffersPage />
      </SmoothScroll>
    ),
  },
  {
    path: "/subservices/:serviceId/offers/:subServiceId/offer/:offerId",
    element: (
      <SmoothScroll>
        <OfferPage />
      </SmoothScroll>
    ),
  },
  {
    path: "/become_seller",
    element: (
      <ProtectedRoute>
        <SmoothScroll>
          <BecomeSellerPage />
        </SmoothScroll>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <SmoothScroll>
          <ProfilePage />
        </SmoothScroll>
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit_profile",
    element: (
      <ProtectedRoute>
        <SmoothScroll>
          <EditProfilePage />
        </SmoothScroll>
      </ProtectedRoute>
    ),
  },
  {
    path: "/personal_info",
    element: (
      <ProtectedRoute>
        <SmoothScroll>
          <PersonalInfoPage />
        </SmoothScroll>
      </ProtectedRoute>
    ),
  },
  // freelancer route

  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <SmoothScroll>
          <DashboardPage />
        </SmoothScroll>
      </PrivateRoute>
    ),
  },
  {
    path: "/earnings",
    element: (
      <PrivateRoute>
        <SmoothScroll>
          <EarningsPage />
        </SmoothScroll>
      </PrivateRoute>
    ),
  },
  // freelancer route

  {
    path: "/manage_offer",
    element: (
      <PrivateRoute>
        <ManageOffer />
      </PrivateRoute>
    ),
  },
  // freelancer route

  {
    path: "/create_offer",
    element: (
      <PrivateRoute>
        <CreateOffer />
      </PrivateRoute>
    ),
  },
  // freelancer route

  {
    path: "/edit_offer/:offerId",
    element: (
      <PrivateRoute>
        <EditOffer />
      </PrivateRoute>
    ),
  },

  {
    path: "/freelancer_profile/:userId",
    element: (
      <SmoothScroll>
        <FreelancerProfilePage />
      </SmoothScroll>
    ),
  },
  // freelancer route
  {
    path: "/manage_order",
    element: (
      <PrivateRoute>
        <ManageOrder />
      </PrivateRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <SmoothScroll>
          <Orders />
        </SmoothScroll>
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <SmoothScroll>
          <ChatPage />
        </SmoothScroll>
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:chatRef",
    element: (
      <ProtectedRoute>
        <SmoothScroll>
          {" "}
          <ChatPage />
        </SmoothScroll>
      </ProtectedRoute>
    ),
  },
  {
    path: "/privacy",
    element: (
      <SmoothScroll>
        <PrivacyPolicy />
      </SmoothScroll>
    ),
  },

  {
    path: "/search",
    element: (
      <SmoothScroll>
        <SearchPage />
      </SmoothScroll>
    ),
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
