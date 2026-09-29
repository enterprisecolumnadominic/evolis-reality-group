//src/modal/MortgageModal.tsx
import React, { useState, useEffect } from "react";
import "./MortgageModal.css";

interface MortgageModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyPrice: number;
  propertyName: string; // 🔑 New
  propertyAddress: string; // 🔑 New
}

const MortgageModal: React.FC<MortgageModalProps> = ({
  isOpen,
  onClose,
  propertyPrice,
  propertyName,
  propertyAddress,
}) => {
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(10); // Defaulting to 10 as requested
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  // Synchronize Down Payment Amount -> Percentage
  const handleAmountChange = (amount: number) => {
    setDownPayment(amount);
    const percent = (amount / propertyPrice) * 100;
    setDownPaymentPercent(Number(percent.toFixed(2)));
  };

  // Synchronize Down Payment Percentage -> Amount
  const handlePercentChange = (percent: number) => {
    setDownPaymentPercent(percent);
    const amount = (percent / 100) * propertyPrice;
    setDownPayment(Number(amount.toFixed(0)));
  };

  // Helper to add commas
  const formatCurrency = (val: number) => {
    return val.toLocaleString("en-PH");
  };

  // Helper to remove commas for calculation
  const parseCurrency = (val: string) => {
    return Number(val.replace(/,/g, ""));
  };

  useEffect(() => {
    const principal = propertyPrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const x = Math.pow(1 + monthlyRate, numberOfPayments);
      const monthly = (principal * x * monthlyRate) / (x - 1);
      setMonthlyPayment(monthly);
    } else if (numberOfPayments > 0) {
      setMonthlyPayment(principal / numberOfPayments);
    }
  }, [propertyPrice, downPayment, interestRate, loanTerm]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="mortgage-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>

        <h2>Mortgage Calculator</h2>

        <div className="price-hint">
          <div className="property-identity">
            <span className="identity-label">Property for Calculation:</span>

            <h3 className="modal-property-name">
              {propertyName} {propertyAddress}
            </h3>
          </div>

          <div className="price-display">
            <span className="identity-label">Property Price</span>
            <strong>₱{propertyPrice.toLocaleString()}</strong>
          </div>
        </div>

        <div className="calculator-grid">
          {/* Dual Down Payment Inputs */}
          <div className="input-row">
            <div className="input-group">
              <label>Down Payment (₱)</label>
              <input
                type="text" /* Changed to text to allow commas */
                value={formatCurrency(downPayment)}
                onChange={(e) =>
                  handleAmountChange(parseCurrency(e.target.value))
                }
              />
            </div>
            <div className="input-group percent-input">
              <label>(%)</label>
              <input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => handlePercentChange(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <label>Loan Term (Years)</label>
            <input
              type="number"
              min="1"
              max="50"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="result-box">
          <h3>Estimated Monthly Payment</h3>
          <p className="monthly-amount">
            ₱
            {monthlyPayment.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <p className="disclaimer">
          * Estimated amounts only. Taxes, insurance, and other fees are not
          included in the computation.
        </p>
      </div>
    </div>
  );
};

export default MortgageModal;
