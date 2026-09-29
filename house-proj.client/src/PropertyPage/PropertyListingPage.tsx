import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThLarge,
  faFilter,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

// API Services and Types
import { getPropertiesPaged } from "../helpers/services/PropertyService";
import "./PropertyListingPage.css";
import PageMeta from "../config/PageMeta";
import { PropertyCard as PropertyCardType } from "../Data/PropertyCard";
import PropertyCardComponent from "./PropertyCard";

import { useTokenPagination } from "../helpers/hooks/useTokenPagination";
import { TokenPagination } from "../helpers/TokenPagination";

// --- 1. Move Mappings Outside (Static Configuration) ---
const typeMap: Record<string, number | undefined> = {
  all: undefined,
  buy: 0,
  rent: 1,
  foreclosed: 2,
};

const subTypeMap: Record<string, number | undefined> = {
  all: undefined,
  "Lot(only)": 0,
  "House & Lot": 1,
  Condominium: 2,
  Commercial: 3,
};

// ... (imports remain the same)

const PropertyListingPage: React.FC = () => {
  // --- 1. Main Data State ---
  const [properties, setProperties] = useState<PropertyCardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // --- 2. Filters ---
  const [filter, setFilter] = useState<string>("all");
  const [subFilter, setSubFilter] = useState<string>("all");
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [debouncedAddress, setDebouncedAddress] = useState("");

  // --- 3. THE BRAIN ---
  const {
    pageIndex,
    currentToken,
    nextToken,
    setNextToken,
    goToNextPage,
    goToPreviousPage,
    resetPagination,
  } = useTokenPagination();

  // --- 4. Functions ---
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getPropertiesPaged(
        12,
        debouncedName,
        debouncedAddress,
        typeMap[filter],
        subTypeMap[subFilter],
        currentToken || undefined,
      );

      setProperties(data.items);
      setNextToken(data.nextToken || null);

      if (data.totalCount > 0) {
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      }
      setError(null);
    } catch (err) {
      console.error("❌ API ERROR:", err);
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilter("all");
    setSubFilter("all");
    setSearchName("");
    setSearchAddress("");
    setDebouncedName("");
    setDebouncedAddress("");
    resetPagination();
  };

  // --- 5. Corrected Effects ---

  // Search Debounce: Only reset if the search actually changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchName !== debouncedName || searchAddress !== debouncedAddress) {
        setDebouncedName(searchName);
        setDebouncedAddress(searchAddress);
        resetPagination();
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [searchName, searchAddress]);

  // Main Fetch: This is the ONLY place fetchProperties should be called
  useEffect(() => {
    fetchProperties();
  }, [currentToken, debouncedName, debouncedAddress, filter, subFilter]);

  return (
    <div className="property-listing-page">
      <PageMeta pageKey="properties" />

      <div className="listing-header-container">
        <h1>Available Properties</h1>
        <div className="listing-controls">
          <div className="filter-controls">
            <label htmlFor="property-filter">
              <FontAwesomeIcon icon={faFilter} className="filter-icon" /> Filter
              By:
            </label>
            <select
              id="property-filter"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                resetPagination(); // 🎯 Added Reset
              }}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="buy">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="foreclosed">Foreclosed</option>
            </select>

            <select
              id="sub-property-filter"
              value={subFilter}
              onChange={(e) => {
                setSubFilter(e.target.value);
                resetPagination(); // 🎯 Added Reset
              }}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Lot(only)">Lot Only</option>
              <option value="House & Lot">House & Lot</option>
              <option value="Condominium">Condominium</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="search-container">
            <label htmlFor="property-search">
              <FontAwesomeIcon icon={faSearch} className="search-icon" /> Search
              By:
            </label>
            <input
              id="property-search"
              type="text"
              placeholder="Name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="search-input"
            />
            <input
              id="search-city"
              type="text"
              placeholder="City..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="search-input"
            />
            <button onClick={resetFilters} className="reset-btn">
              Clear All
            </button>
          </div>

          <div className="view-controls">
            <FontAwesomeIcon icon={faThLarge} className="control-icon active" />
            <span className="count-text">Showing {totalCount} Results</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loader"></div>
          <p>Finding your perfect home...</p>
        </div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="property-grid-container">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCardComponent key={property.id} property={property} />
            ))
          ) : (
            <div className="no-results">
              <p>No properties match your selection.</p>
            </div>
          )}
        </div>
      )}

      {/* 🎯 Updated Pagination props to use pageIndex and handlePageChange */}
      {!loading && totalPages > 1 && (
        <TokenPagination
          currentPage={pageIndex}
          totalPages={totalPages}
          hasNextPage={!!nextToken}
          onNext={goToNextPage}
          onPrev={goToPreviousPage}
        />
      )}
    </div>
  );
};

export default PropertyListingPage;
