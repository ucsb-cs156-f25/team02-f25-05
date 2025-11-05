import { Routes, Route } from "react-router";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import RecommendationRequestEditPage from "main/pages/RecommendationRequest/RecommendationRequestEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

import HelpRequestIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import MenuItemReviewsIndexPage from "main/pages/MenuItemReviews/MenuItemReviewsIndexPage";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

import { hasRole, useCurrentUser } from "main/utils/useCurrentUser";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const currentUser = useCurrentUser();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {hasRole(currentUser, "ROLE_ADMIN") && (
        <Route path="/admin/users" element={<AdminUsersPage />} />
      )}

      {/* UCSB Dates */}
      {hasRole(currentUser, "ROLE_USER") && (
        <Route path="/ucsbdates" element={<UCSBDatesIndexPage />} />
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
          <Route path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
        </>
      )}

      {/* Restaurants */}
      {hasRole(currentUser, "ROLE_USER") && (
        <Route path="/restaurants" element={<RestaurantIndexPage />} />
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route path="/restaurants/edit/:id" element={<RestaurantEditPage />} />
          <Route path="/restaurants/create" element={<RestaurantCreatePage />} />
        </>
      )}

      {/* Recommendation Request */}
      {hasRole(currentUser, "ROLE_USER") && (
        <Route
          path="/recommendationRequest"
          element={<RecommendationRequestIndexPage />}
        />
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            path="/recommendationRequest/edit/:id"
            element={<RecommendationRequestEditPage />}
          />
          <Route
            path="/recommendationRequest/create"
            element={<RecommendationRequestCreatePage />}
          />
        </>
      )}

      {/* MenuItemReviews */}
      {hasRole(currentUser, "ROLE_USER") && (
        <Route
          path="/menuItemReviews"
          element={<MenuItemReviewsIndexPage />}
        />
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            path="/menuItemReviews/edit/:id"
            element={<MenuItemReviewsEditPage />}
          />
          <Route
            path="/menuItemReviews/create"
            element={<MenuItemReviewsCreatePage />}
          />
        </>
      )}

      {/* Help Requests */}
      {hasRole(currentUser, "ROLE_USER") && (
        <Route path="/helprequests" element={<HelpRequestIndexPage />} />
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            path="/helprequests/edit/:id"
            element={<HelpRequestEditPage />}
          />
          <Route
            path="/helprequests/create"
            element={<HelpRequestCreatePage />}
          />
        </>
      )}

      {/* Placeholder */}
      {hasRole(currentUser, "ROLE_USER") && (
        <Route path="/placeholder" element={<PlaceholderIndexPage />} />
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            path="/placeholder/edit/:id"
            element={<PlaceholderEditPage />}
          />
          <Route
            path="/placeholder/create"
            element={<PlaceholderCreatePage />}
          />
        </>
      )}

      {/* Articles */}
      {hasRole(currentUser, "ROLE_USER") && (
        <Route path="/articles" element={<ArticlesIndexPage />} />
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route path="/articles/edit/:id" element={<ArticlesEditPage />} />
          <Route path="/articles/create" element={<ArticlesCreatePage />} />
        </>
      )}
    </Routes>
  );
}

export default App;
