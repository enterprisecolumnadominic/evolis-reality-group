import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./admin/hooks/useAuthContext";
import { ProtectedRoute } from "./admin/hooks/ProtectedRoute";

// Components
import Header from "./header/Header";
import Footer from "./footer/Footer";
import CredentialsBar from "./credentialsBar/CredentialsBar";
import HeroBanner from "./HeroBanner/HeroBanner";
import OurServices from "./OurServices/OurServices";
import EmployeeCarousel from "./carousel/EmployeeCarousel";
import PropertyCarousel from "./carousel/PropertyCarousel";

// Pages
import PropertyListingPage from "./PropertyPage/PropertyListingPage";
import PropertyDetailsPage from "./PropertyPage/PropertyDetailsPage/PropertyDetailsPage";
import TeamPage from "./Team/TeamPage";
import ContactPage from "./Contact/ContactPage";
import LoginPage from "./admin/LoginPage";
import AdminDashboard from "./admin/AdminDashboard";
import AddPropertyPage from "./admin/AddPropertyPage";
import AddTeamPage from "./admin/AddTeamPage";
import ContentDetailPage from "./ContentPage/ContentDetailPage";
import LoanPage from "./loans/LoanPage";
import PreQualifyForm from "./loans/PreQualify/PreQualifyForm";
import PageMeta from "./config/PageMeta";

// Service & Config
import ApiService from "./helpers/services/ApiService";
import config from "./config/apiConfig.json";
import AddContentPage from "./admin/AddContentPage";
import ContentListPage from "./ContentPage/ContentListPage";
import LatestInsights from "./carousel/LatestInsights";
import { useDebounce } from "./helpers/hooks/useDebounce";

import { ScrollToTop } from "./helpers/ScrollToTop";

const HomePageContent = () => (
  <main>
    <PageMeta pageKey="home" />
    <HeroBanner />
    <OurServices />
    <PropertyCarousel type="buy" delay={200} />
    <PropertyCarousel type="foreclosed" delay={200} />
    <LatestInsights delay={300} />/
    {/* <EmployeeCarousel sectionTitle="Meet Our Team" delay={700} /> */}
  </main>
);

const NotFoundPage = () => (
  <>
    <PageMeta pageKey="notFound" />
    <h1 className="not-found">404 - Page Not Found</h1>
  </>
);

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const debouncedInitialized = useDebounce(isInitialized, 200);

  useEffect(() => {
    const initSession = async () => {
      try {
        // 🎯 Using the endpoint from config
        await ApiService.get(config.endpoints.sessionInit);
        console.log("✅ Session Bridge Established");
        setIsInitialized(true);
      } catch (error) {
        console.error("❌ Session Bridge Failed:", error);
      }
    };

    initSession();
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <PageMeta pageKey="home" />

        <BrowserRouter>
          <ScrollToTop />
          <div className="App">
            <Header />

            {!debouncedInitialized ? (
              <div className="loading-screen">
                <div className="loader"></div>
                <p>Initializing Session...</p>
              </div>
            ) : (
              <>
                <Routes>
                  {/* --- PUBLIC ROUTES --- */}
                  <Route path="/" element={<HomePageContent />} />

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/properties" element={<PropertyListingPage />} />
                  <Route
                    path="/properties/:id"
                    element={<PropertyDetailsPage />}
                  />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/content" element={<ContentListPage />} />
                  <Route
                    path="/Content/:type/:slug"
                    element={<ContentDetailPage />}
                  />
                  <Route path="/loans" element={<LoanPage />} />
                  <Route path="/pre-qualify" element={<PreQualifyForm />} />

                  {/* --- 🛡️ SECURE ADMIN ROUTES --- */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route
                      path="/addProperty/:id?"
                      element={<AddPropertyPage />}
                    />
                    <Route path="/addTeam/:id?" element={<AddTeamPage />} />
                    <Route
                      path="/addContent/:id?"
                      element={<AddContentPage />}
                    />
                  </Route>

                  {/* --- 404 --- */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                <CredentialsBar />
              </>
            )}

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
