// src/carousel/EmployeeCarousel.tsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { getAllEmployees } from "../helpers/services/TeamService";
import { Employee_Profile } from "../Data/Employee_Profile";
import AgentProfileCard from "../Team/AgentProfileCard";
import "./EmployeeCarousel.css";

interface EmployeeCarouselProps {
  sectionTitle: string;
  delay?: number;
}

const EmployeeCarousel: React.FC<EmployeeCarouselProps> = ({
  sectionTitle,
  delay = 0,
}) => {
  const [employees, setEmployees] = useState<Employee_Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await getAllEmployees(1, 10, true);
        const data = response.items || [];

        // Handle both camelCase and PascalCase for safety
        const active = data.filter(
          (emp: any) => emp.IsActive === true || emp.isActive === true,
        );
        setEmployees(active);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    //Set the staggered timer
    const timer = setTimeout(() => {
      fetchEmployees();
    }, delay);

    //Standard cleanup
    return () => clearTimeout(timer);
  }, [delay]); // Re-run if delay changes

  if (loading && employees.length === 0) {
    return <div className="loader">{sectionTitle} Loading...</div>;
  }
  const nextEmployee = () =>
    setCurrentIndex((prev) => (prev + 1) % employees.length);
  const prevEmployee = () =>
    setCurrentIndex((prev) => (prev - 1 + employees.length) % employees.length);

  if (loading) return <div className="loader">Loading Team...</div>;
  if (employees.length === 0) return null;

  return (
    <div className="employee-carousel-section">
      <h2 className="section-title">{sectionTitle}</h2>
      <p className="section-subtitle">Meet Our Professionals</p>

      <div className="agent-slider-wrapper">
        <button className="agent-nav-btn prev-btn" onClick={prevEmployee}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div
          className="carousel-card-container"
          key={employees[currentIndex].id || currentIndex}
        >
          <AgentProfileCard agent={employees[currentIndex]} />
        </div>

        <button className="agent-nav-btn next-btn" onClick={nextEmployee}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <div className="agent-carousel-indicators">
        {employees.map((_, index) => (
          <span
            key={`dot-${index}`}
            className={`agent-indicator-dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeeCarousel;
