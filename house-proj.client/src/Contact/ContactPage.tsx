import React from "react";
import PageMeta from "../config/PageMeta";
import ContactFormSection from "./ContactFormSection";
import { BUSINESS_CONFIG } from "../config/BusinessConfig";
import WorkWithUs from "./WorkWithUs";
import "./ContactPage.css";

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page-container container">
      <PageMeta pageKey="contact" />

      <WorkWithUs />

      {/* 2. Main Contact Form Area */}
      <div id="contact-form-anchor" style={{ paddingTop: "60px" }}>
        <h1 className="section-subtitle">Get In Touch</h1>
        <ContactFormSection />
      </div>
    </div>
  );
};

export default ContactPage;
