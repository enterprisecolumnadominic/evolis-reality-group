import { useState, useEffect } from "react";
import { getPropertiesPaged } from "../../helpers/services/PropertyService";
import { PropertyCard } from "../../Data/PropertyCard";
import { PagedResponse } from "../../Data/PagedResponse";

export const usePropertyData = (
  currentToken: string | null, // 🎯 Now accepting a token instead of a page number
  nameTerm: string,
  addressTerm: string,
  filter: string,
  subFilter: string,
) => {
  const [properties, setProperties] = useState<PropertyCard[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null); // 🎯 To store the next cursor
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to map filters (matching your previous logic)
  const typeValue = filter === "buy" ? 0 : filter === "rent" ? 1 : undefined;

  const subTypeMap: Record<string, number> = {
    "Lot(only)": 0,
    "House & Lot": 1,
    Condominium: 2,
    Commercial: 3,
  };
  const subTypeValue = subFilter !== "all" ? subTypeMap[subFilter] : undefined;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: PagedResponse<PropertyCard> = await getPropertiesPaged(
          12, // PageSize
          nameTerm,
          addressTerm,
          typeValue,
          subTypeValue,
          currentToken || "", // 🎯 Pass the token to the service
        );

        setProperties(data.items);
        setNextToken(data.nextToken || null); // 🎯 Capture the new token for the "Next" button
        setTotalCount(data.totalCount);
        setError(null);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to fetch properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // 🎯 Triggered whenever the token or filters change
  }, [currentToken, nameTerm, addressTerm, filter, subFilter]);

  return { properties, nextToken, totalCount, loading, error };
};
