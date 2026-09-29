/* src/PropertyPage/PropertyDetailsPage/components/Features/PropertyDetailFeatures.tsx */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBed,
  faBath,
  faLayerGroup,
  faRulerCombined,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Available_Properties } from "../../../../Data/Available_Properties";
import "./PropertyDetailFeatures.css";

// 🎯 Update props to use the shared interface
interface PropertyDetailFeaturesProps {
  property: Available_Properties;
}

const PropertyDetailFeatures: React.FC<PropertyDetailFeaturesProps> = ({
  property,
}) => {
  // 🎯 Map numeric Enums to readable labels
  const subTypeLabels: Record<number, string> = {
    0: "Lot Only",
    1: "House & Lot",
    2: "Condominium",
    3: "Commercial",
  };

  return (
    <div className="details-main-content">
      <div className="details-info">
        <h2 className="section-heading">Key Features</h2>
        <div className="details-features">
          <div className="feature-box">
            <FontAwesomeIcon icon={faHome} className="feature-icon" />
            {/* 🎯 Use the label mapping here */}
            <span>{subTypeLabels[property.subPropertyType] || "Property"}</span>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faBed} className="feature-icon" />
            <span>Beds: {property.bedrooms}</span>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faBath} className="feature-icon" />
            <span>Baths: {property.bathrooms}</span>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faLayerGroup} className="feature-icon" />
            <span>Levels: {property.levels}</span>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faRulerCombined} className="feature-icon" />
            <span>{property.floorSpace} SqM</span>
          </div>

          <div className="feature-box">
            <FontAwesomeIcon icon={faCalendarAlt} className="feature-icon" />
            <span>Built: {property.builtYear}</span>
          </div>
        </div>

        <h2 className="section-heading">Property Description</h2>
        <p className="description-text">{property.description}</p>
      </div>
    </div>
  );
};

export default PropertyDetailFeatures;
