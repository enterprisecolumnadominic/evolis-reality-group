import React from "react";
import PageMeta from "../config/PageMeta";
import LoanHeroBanner from "../HeroBanner/LoanBanner";
import PropertyCarousel from "../carousel/PropertyCarousel";
import LoanExpertise from "./LoanExpertise";
import LoanProcess from "./LoanProcess";
import LoanTypes from "./LoanTypes";
import "./LoanPage.css";

const LoanPage: React.FC = () => {
  return (
    <main>
      <PageMeta pageKey="loan" />

      <LoanHeroBanner />

      <LoanProcess />

      <LoanTypes />

      <LoanExpertise />

      <section className="loan-page-exclusive-deals-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="loan-page-exclusive-title">Exclusive Bank Offers</h2>
            <div className="loan-page-title-underline"></div>
            <p className="loan-page-exclusive-description mt-3">
              Direct access to bank-owned assets with competitive financing
              pre-arranged for qualified buyers.
            </p>
          </div>

          <PropertyCarousel type="foreclosed" delay={200} />
        </div>
      </section>
    </main>
  );
};

export default LoanPage;
