import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faThumbtack,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import "./PropertyDetailHeader.css";

interface HeaderProps {
  name: string;
  address: string;
  type: string;
  price: string;
}

const PropertyDetailHeader: React.FC<HeaderProps> = ({
  name,
  address,
  type,
  price,
}) => {
  const navigate = useNavigate();

  return (
    <div className="details-header">
      <div className="top-nav-bar">
        <button className="back-button" onClick={() => navigate("/properties")}>
          <FontAwesomeIcon icon={faChevronLeft} /> Back to Listings
        </button>

        <span
          className={`status-badge-small ${type.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <FontAwesomeIcon icon={faThumbtack} />
          {type.toUpperCase()}
        </span>
      </div>

      <div className="details-title-bar">
        <h3>{name}</h3>
        <p className="details-price">{price}</p>
      </div>

      <div className="details-sub-header">
        <p className="details-address">
          <FontAwesomeIcon icon={faMapMarkerAlt} /> {address}
        </p>
      </div>
    </div>
  );
};

export default PropertyDetailHeader;
