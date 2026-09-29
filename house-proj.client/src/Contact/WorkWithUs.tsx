import React from "react";
import "./WorkWithUs.css";

const WorkWithUs: React.FC = () => {
  const collaborationTypes = [
    {
      title: "Are you an Agent or Broker?",
      description:
        "Looking to scale? Join our professional network to gain access to premium listings and a collaborative platform built for growth.",
      image:
        "https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Are you a Landlord or Property Manager?",
      description:
        "Want to boost your property's popularity? List with us to get your rentals and find the perfect match through our digital reach.",
      image:
        "https://images.unsplash.com/photo-1733244766159-f58f4184fd38?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Are you a Homeowner?",
      description:
        "Ready to sell? Get a professional valuation and expert marketing to ensure your property sells quickly and at the best possible price.",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "For Banking & Loan Partners",
      description:
        "Join our network of financial partners to provide seamless mortgage solutions and build trusted relationships within our active property market.",
      image:
        "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Interior Design Service",
      description:
        "Need a space transformation? From professional staging to full interior renovations, our dedicated design team brings aesthetic value and vision to your property.",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Want to Advertise",
      description:
        "Need more exposure? Whether you are a brand or a developer, leverage our platform to showcase your services to thousands of customers.",
      image:
        "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const scrollToForm = () => {
    const formElement = document.getElementById("contact-form-anchor");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="wwu-main-container container py-5">
      <div className="wwu-header text-center mb-5">
        <span className="wwu-section-tag">Partnerships</span>
        <h2 className="wwu-section-subtitle">Collaborate With Us</h2>
        <div className="wwu-title-underline"></div>
      </div>

      <div className="row g-4">
        {collaborationTypes.map((item, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="wwu-split-card" onClick={scrollToForm}>
              <div className="wwu-card-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="wwu-card-img"
                />
              </div>
              <div className="wwu-card-text-area">
                <h3 className="wwu-card-title-dark">{item.title}</h3>
                <p className="wwu-description-dark">{item.description}</p>
                <span className="wwu-inquiry-link">Send Inquiry →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkWithUs;
