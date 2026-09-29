import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { getPropertiesPaged } from "../helpers/services/PropertyService";
import { PropertyCard as PropertyCardType } from "../Data/PropertyCard";
import { useDebounce } from "../helpers/hooks/useDebounce";
import "./PropertyCarousel.css";
import PropertyCard from "../PropertyPage/PropertyCard";

// 🎯 Update the type to include 'foreclosed'
interface PropertyCarouselProps {
  type: "buy" | "rent" | "foreclosed";
  delay?: number;
}

const PropertyCarousel: React.FC<PropertyCarouselProps> = ({
  type,
  delay = 0,
}) => {
  const [properties, setProperties] = useState<PropertyCardType[]>([]);
  const [loading, setLoading] = useState(true);

  const debouncedType = useDebounce(type, 600);

  // 🎯 Map types to your Database IDs: 0: Buy, 1: Rent, 2: Foreclosed
  const TARGET_TYPE_ID =
    debouncedType === "buy" ? 0 : debouncedType === "rent" ? 1 : 2;

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const responseData = await getPropertiesPaged(
          6, // items per page
          "",
          "",
          TARGET_TYPE_ID,
        );

        const items = responseData?.items || [];
        setProperties(items.slice(0, 5));
      } catch (error) {
        console.error(`Carousel [${debouncedType}] Error:`, error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadProperties();
    }, delay);

    return () => clearTimeout(timer);
  }, [debouncedType, TARGET_TYPE_ID, delay]);

  return (
    <div
      className={`property-carousel-section ${type}-section container-fluid`}
    >
      <h2 className="section-title">NEW PROPERTIES</h2>
      <p className="section-subtitle">
        {/* 🎯 Update display labels */}
        {type === "buy" && "FOR SALE"}
        {type === "rent" && "FOR RENT"}
        {type === "foreclosed" && "FORECLOSED"}
      </p>

      {loading ? (
        <div className="carousel-skeleton-loader">
          <p>Loading properties...</p>
        </div>
      ) : (
        <div className="property-list-container">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          ) : (
            <p className="no-properties">
              No properties found in this category.
            </p>
          )}
        </div>
      )}

      <div className="view-more-container">
        <Link to="/properties">
          <button className="view-more-button">
            View All {type === "foreclosed" ? "Foreclosures" : "Listings"}
            <FontAwesomeIcon icon={faArrowRight} className="button-icon" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PropertyCarousel;
