import React from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../helpers/CurrencyHelper";
import { Pagination } from "../../helpers/PaginationHelper";

const propertyTypeLabels: Record<number, string> = {
  0: "BUY",
  1: "RENT",
  2: "Foreclosed",
};
const subTypeMap: Record<number, string> = {
  0: "Lot(only)",
  1: "House & Lot",
  2: "Condominium",
  3: "Commercial",
};
const INVALID_GUID = "00000000-0000-0000-0000-000000000000";

interface PropertyTableProps {
  properties: any[];
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({
  properties,
  page,
  totalPages,
  setPage,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Property Name</th>
            <th>Location</th>
            <th>Price</th>
            <th>Type</th>
            <th>Sub-Type</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((prop, index) => {
            const isIdValid = prop.id && prop.id !== INVALID_GUID;
            return (
              <tr
                key={isIdValid ? prop.id : `prop-${index}`}
                className="admin-row"
              >
                <td>
                  <strong>{prop.name}</strong>
                </td>
                <td>{prop.address}</td>
                <td>{formatCurrency(prop.price)}</td>
                <td>
                  <span
                    className={`type-tag type-${propertyTypeLabels[prop.propertyType].toLowerCase()}`}
                  >
                    {propertyTypeLabels[prop.propertyType]}
                  </span>
                </td>
                <td>
                  <span className="sub-type-tag">
                    {subTypeMap[prop.subPropertyType]}
                  </span>
                </td>
                <td>{new Date(prop.dateCreated).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`status-badge ${prop.isEnabled ? "enabled" : "disabled"}`}
                  >
                    {prop.isEnabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/addProperty/${prop.id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="admin-pagination-footer">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
        <p className="page-info">
          Page {page} of {totalPages}
        </p>
      </div>
    </>
  );
};
