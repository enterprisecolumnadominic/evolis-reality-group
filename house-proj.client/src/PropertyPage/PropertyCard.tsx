import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faBath,
  faLayerGroup,
  faRulerCombined,
  faMapMarkerAlt,
  faHouse,
} from "@fortawesome/free-solid-svg-icons";

// 1. IMPORT the DTO interface (ensure the path is correct for your models folder)
import { PropertyCard as PropertyCardDTO } from "../Data/PropertyCard";
import "./PropertyCard.css";
import { formatCurrency } from "../helpers/CurrencyHelper";

interface PropertyCardProps {
  // 🎯 Change this from Available_Properties to your DTO
  property: PropertyCardDTO;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Enum Mappings
  const propertyTypeLabels: Record<number, string> = {
    0: "Buy",
    1: "Rent",
    2: "Foreclosed",
  };
  const subPropertyTypeLabels: Record<number, string> = {
    0: "Lot Only",
    1: "House & Lot",
    2: "Condominium",
    3: "Commercial",
  };

  // 🛡️ Safety Check for Image using the DTO's thumbnailUrl
  const displayImage =
    property.thumbnailUrl || "https://placehold.co/400x300/png";
  const typeLabel = propertyTypeLabels[property.propertyType] || "Unknown";

  return (
    <div className="property-card">
      <div className="card-image-wrapper">
        <Link to={`/properties/${property.id}`}>
          <img
            src={displayImage}
            alt={property.name}
            className="property-image"
          />
        </Link>
        <span className={`card-badge badge-type-${typeLabel.toLowerCase()}`}>
          {typeLabel}
        </span>
      </div>

      <div className="card-details">
        <div className="card-header-row">
          <h3 className="card-name">
            <Link to={`/properties/${property.id}`}>{property.name}</Link>
          </h3>
          <p className="card-price">{formatCurrency(property.price)}</p>
        </div>

        <div className="card-location-type-row">
          <p className="card-address">
            <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.address}
          </p>
          <span className="card-sub-type">
            <FontAwesomeIcon icon={faHouse} />{" "}
            {subPropertyTypeLabels[property.subPropertyType]}
          </span>
        </div>

        <div className="card-features-grid">
          <div className="card-sub-type">
            <FontAwesomeIcon icon={faBed} />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="card-sub-type">
            <FontAwesomeIcon icon={faBath} />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="card-sub-type">
            <FontAwesomeIcon icon={faLayerGroup} />
            <span>{property.levels} Lvl</span>
          </div>
          <div className="card-sub-type">
            <FontAwesomeIcon icon={faRulerCombined} />
            <span>{property.floorSpace}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
