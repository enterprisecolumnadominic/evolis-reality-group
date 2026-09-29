import React from "react";
import "./LoanTypes.css";

const LoanTypes: React.FC = () => {
  const loanPrograms = [
    {
      className: "lt-fixed",
      title: "Fixed-Rate Mortgages",
      desc: "Enjoy the stability and predictability of a locked rate for the life of your loan. A classic choice for those seeking long-term financial security.",
    },
    {
      className: "lt-jumbo",
      title: "Jumbo Loans",
      desc: "Secure financing for high-value properties that exceed conventional loan limits. Our bespoke advisory ensures complex financing remains streamlined.",
    },
    {
      className: "lt-gov",
      title: "FHA & VA Loans",
      desc: "Explore government-backed loans designed to make home ownership more accessible. We guide eligible veterans and first-time buyers with expert care.",
    },
  ];

  return (
    <section
      id="lt-component-wrapper"
      className="lt-main-container container-fluid py-5"
    >
      <div className="lt-header text-center mb-5">
        <h2 className="section-title">
          Tailored financing solutions for every milestone.
        </h2>
        <div className="title-underline"></div>
      </div>

      <div className="row g-4 px-lg-5">
        {loanPrograms.map((loan, index) => (
          <div key={index} className="col-12 col-md-4">
            <div className="lt-split-card">
              {/* Top Half: Image */}
              <div className={`lt-card-image ${loan.className}`}></div>

              {/* Bottom Half: Content (Title + Description) */}
              <div className="lt-card-content">
                <h3 className="lt-internal-card-title">{loan.title}</h3>
                <p className="lt-description">{loan.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LoanTypes;
