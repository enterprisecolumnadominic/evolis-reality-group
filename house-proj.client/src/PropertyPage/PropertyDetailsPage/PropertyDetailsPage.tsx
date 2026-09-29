import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Hooks & Helpers
import { usePropertyDetails } from "../hooks/usePropertyDetails";
import { formatCurrency } from "../../helpers/CurrencyHelper";
import { getEmployeeById } from "../../helpers/services/TeamService";
import { Employee_Profile } from "../../Data/Employee_Profile";

// Components
import PropertyDetailHeader from "./components/Header/PropertyDetailHeader";
import PropertyDetailGallery from "./components/Gallery/PropertyDetailGallery";
import PropertyDetailFeatures from "./components/Features/PropertyDetailFeatures";
import PropertyContactSection from "./components/PropertyContactSection/PropertyContactSection";

// Modals
import InquiryModal from "../../modal/InquiryModal";
import MortgageModal from "../../modal/MortgageModal";
import AgentModal from "../../modal/AgentModal";

import "./PropertyDetailsPage.css";
import PageMeta from "../../config/PageMeta";
import { BUSINESS_CONFIG } from "../../config/BusinessConfig";

const PropertyDetailsPage: React.FC = () => {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  // 1. Get 'id' from URL (Ensure your App.tsx route uses :id or :guid)
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Employee_Profile | null>(null);

  // 2. Use the updated Hook
  const {
    property,
    loading,
    error,
    imageIndex,
    mediaItems,
    switchImage,
    handleThumbnailClick,
  } = usePropertyDetails(id);

  // 🎯 EFFECT: Fetch Agent when property is loaded
  useEffect(() => {
    if (
      property?.employeeProfileID &&
      property.employeeProfileID !== "00000000-0000-0000-0000-000000000000"
    ) {
      getEmployeeById(property.employeeProfileID)
        .then((data) => setAgent(data))
        .catch((err) => console.error("Agent fetch error:", err));
    }
  }, [property]);

  // Social Share Logic
  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(
    property?.name
      ? `Check out this property: ${property.name}`
      : "Check out this property!",
  );

  // 3. Loading & Error States
  if (loading)
    return (
      <div className="details-loading container">
        Loading property details...
      </div>
    );
  if (error || !property) {
    return (
      <div className="details-not-found container">
        <h1>{error ? "Error Loading Property" : "Property Not Found"}</h1>
        <p>{error}</p>
      </div>
    );
  }

  // 4. Map the Property Type (0 -> Buy, 1 -> Rent, 2 -> Foreclosed)
  const getDisplayType = (type: number) => {
    switch (type) {
      case 1:
        return "For Rent";
      case 2:
        return "Foreclosed";
      default:
        return "For Sale";
    }
  };

  const displayType = getDisplayType(property.propertyType);

  return (
    <div className="property-details-page">
      {/* 🎯 SEO DYNAMIC TAGS */}
      <PageMeta
        pageKey="properties"
        customTitle={`${property.name} - ${property.address}`}
        customDescription={`${displayType}: ${property.name} at ${property.address}. Discover features, view the map, and contact us for a viewing today.`}
      />

      <PropertyDetailHeader
        name={property.name}
        address={property.address}
        type={displayType}
        // 🎯 If propertyType is 1 (Rent), add the "per month" suffix
        price={`${formatCurrency(property.price)}${property.propertyType === 1 ? " / month" : ""}`}
      />

      <div className="main-content-layout-wrapper container clearfix">
        {/* 🛡️ Update: Gallery now receives the MediaItem array */}
        <PropertyDetailGallery
          mediaItems={mediaItems}
          imageIndex={imageIndex}
          propertyName={property.name}
          switchImage={switchImage}
          handleThumbnailClick={handleThumbnailClick}
        />

        <PropertyDetailFeatures property={property} />
      </div>

      <PropertyContactSection
        latitude={property.latitude}
        longitude={property.longitude}
        onInquiryOpen={() => setIsInquiryOpen(true)}
        onMortgageOpen={() => setIsMortgageOpen(true)}
        onAgentOpen={() => setIsAgentOpen(true)}
        shareUrl={window.location.href}
        shareTitle={property.name}
        isRent={property.propertyType === 1}
        agent={agent}
      />

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        propertyName={property.name}
        propertyAddress={property.address}
        agentEmail={agent?.email || BUSINESS_CONFIG.contact.email}
      />

      <MortgageModal
        isOpen={isMortgageOpen}
        onClose={() => setIsMortgageOpen(false)}
        propertyPrice={property.price}
        propertyName={property.name}
        propertyAddress={property.address}
      />

      <AgentModal
        isOpen={isAgentOpen}
        onClose={() => setIsAgentOpen(false)}
        agent={agent}
      />
    </div>
  );
};

export default PropertyDetailsPage;
