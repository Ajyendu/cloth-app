import React, { useState, useContext, useEffect, useRef } from "react";
import ClothContext from "./Context/Cloth/ClothContext";
import "./Form.css";
import gstIcon from "../assets/gstIcon.png";
import pantIcon from "../assets/pant.png";
import coatIcon from "../assets/coat.png";
import halfShirtIcon from "../assets/halfshirt.png";
import shirtIcon from "../assets/shirt.png";
import adminIcon from "../assets/adminIcon.png";

const Form = () => {
  const [clothDetails, setClothDetails] = useState({ type: "", price: "" });
  const [embroideryCharges, setEmbroideryCharges] = useState("");
  const [extraCharges, setExtraCharges] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState("");

  const context = useContext(ClothContext);
  const { calculate, result, costPrice, setCostPrice, withGST, setWithGST } =
    context;

  const summaryRef = useRef();

  const handlePrintSummary = () => {
    const summary = document.getElementById("summary-to-print");
    if (!summary) return;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Summary</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" />
          <style>
            body {
              margin: 0;
              padding: 30px;
              background-color: #f8f9fa;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
            }
  
            .print-card {
              background-color: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              padding: 24px;
              width: 90vw;
              min-height: 800px; /* Avoid vh on mobile */
              margin: auto;
            }
  
            .summary-header {
              font-weight: 600;
              margin-bottom: 8px;
              font-size: 16px;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #dee2e6;
              padding: 6px 0;
            }
  
            table {
              margin-top: 16px;
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            }
  
            th, td {
              padding: 10px 8px;
              border: 1px solid #dee2e6;
              text-align: center;
            }
  
            th {
              background-color: #f1f3f5;
              font-weight: 600;
            }
  
            .branding {
              height: 300px;
            }
  
            .branding2 {
              height: 130px;
            }
  
            @media print {
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-card">
            <div class="branding"></div>
            ${summary.innerHTML}
          
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Give time for layout to render before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  };

  const handleChange = (e) => {
    setClothDetails({ ...clothDetails, [e.target.name]: e.target.value });
  };

  const handleCalculateClick = (e) => {
    e.preventDefault();
    const embroidery = parseFloat(embroideryCharges) || 0;
    const extra = parseFloat(extraCharges) || 0;

    if (!clothDetails.type || !clothDetails.price) {
      alert("All fields must be filled!");
      return;
    }

    calculate(
      clothDetails.type,
      parseFloat(clothDetails.price),
      embroidery,
      extra
    );

    setSubmitted(true);
    setSubmittedType(clothDetails.type);

    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (submitted) {
      const embroidery = parseFloat(embroideryCharges) || 0;
      const extra = parseFloat(extraCharges) || 0;

      if (clothDetails.type && clothDetails.price) {
        calculate(
          clothDetails.type,
          parseFloat(clothDetails.price),
          embroidery,
          extra
        );
      }
    }
  }, [
    submitted,
    clothDetails.type,
    clothDetails.price,
    embroideryCharges,
    extraCharges,
    calculate,
  ]);

  return (
    <div>
      <div className="center-page no-print">
        <div className="cloth-data-form ">
          <div className="cloth-type-choose">
            <div className="form-container">
              <h2>Select Clothing Type</h2>
            </div>

            <div className="form-container">
              <div className="cloth-selector">
                {[
                  { type: "Half-Shirt", icon: halfShirtIcon },
                  { type: "Full-shirt", icon: shirtIcon },
                  { type: "Pant", icon: pantIcon },
                  { type: "Half-Pant", icon: coatIcon },
                  { type: "Coat", icon: coatIcon },
                  { type: "Skirt", icon: coatIcon },
                  { type: "Lower", icon: coatIcon },
                ].map(({ type, icon }) => (
                  <label className="radio-tile-container" key={type}>
                    <input
                      className="radio-input"
                      type="radio"
                      name="clothType"
                      onClick={() => setClothDetails({ ...clothDetails, type })}
                    />
                    <span className="radio-tile">
                      <span className="radio-icon"></span>
                      <img
                        src={icon}
                        alt={type}
                        width={30}
                        height={30}
                        style={{ display: "block", objectFit: "contain" }}
                      />
                      <span className="radio-label">{type}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-container">
              <div>
                <strong>Selected Type:</strong> {clothDetails.type || "None"}
              </div>
            </div>
          </div>

          {clothDetails.type && (
            <>
              <div className="price-input-div">
                <input
                  required
                  type="number"
                  name="price"
                  autoComplete="off"
                  className="price-input"
                  value={clothDetails.price}
                  onChange={handleChange}
                />
                <label className="price-label">Fabric Price</label>
              </div>

              <div className="price-input-div">
                <input
                  required
                  type="number"
                  className="price-input"
                  value={embroideryCharges}
                  onChange={(e) => setEmbroideryCharges(e.target.value)}
                />
                <label className="price-label">Embroidery Charges</label>
              </div>

              <div className="price-input-div">
                <input
                  required
                  type="number"
                  className="price-input"
                  value={extraCharges}
                  onChange={(e) => setExtraCharges(e.target.value)}
                />
                <label className="price-label">Extra Charges (if any)</label>
              </div>

              <div>
                <div className="d-flex  gap-2">
                  {/* Admin toggle */}
                  <div className="admin_button">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={costPrice}
                        onChange={() => {
                          const newValue = !costPrice;
                          setCostPrice(newValue);
                        }}
                      />
                      <span className="slider">
                        <span className="title">Admin</span>
                        <span className="ball">
                          <span className="icon">
                            <img
                              src={adminIcon}
                              alt="Admin"
                              width={22}
                              height={22}
                              style={{ display: "block", objectFit: "contain" }}
                            />
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>

                  {/* GST toggle */}

                  <div className="admin_button">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={withGST}
                        onChange={() => setWithGST((prev) => !prev)}
                      />
                      <span className="slider">
                        <span className="title">GST</span>
                        <span className="ball">
                          <span className="icon">
                            <img
                              src={gstIcon}
                              alt="GST"
                              width={22}
                              height={22}
                              style={{
                                display: "block",
                                objectFit: "contain",
                              }}
                            />
                          </span>
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="text-center my-4">
                <button className="fancy-button" onClick={handleCalculateClick}>
                  <span className="button_top">Calculate</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {submitted && (
        <div
          className="container my-4 p-4 border rounded shadow bg-light"
          id="summary-to-print"
        >
          <ul className="list-group mb-2" style={{ fontSize: "15px" }}>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Item Type:</strong>
              <span>{submittedType}</span>
            </li>
            {embroideryCharges && (
              <li className="list-group-item d-flex justify-content-between">
                <strong>Embroidery Charges:</strong>
                <span>₹{embroideryCharges}</span>
              </li>
            )}
            {extraCharges && (
              <li className="list-group-item d-flex justify-content-between">
                <strong>Extra Charges:</strong>
                <span>₹{extraCharges}</span>
              </li>
            )}
            <li className="list-group-item d-flex justify-content-between">
              <strong>Include GST:</strong>
              <span>{withGST ? "Yes" : "No"}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <strong>Price:</strong>
              <span>₹{clothDetails.price}</span>
            </li>
          </ul>

          <div className="table-responsive" ref={summaryRef}>
            <table className="result-table">
              <thead>
                <tr>
                  <th>Size</th>
                  {costPrice && <th>Cost Price (₹)</th>}
                  <th>Sale Price (₹)</th>
                  {costPrice && <th>Profit (₹)</th>}
                </tr>
              </thead>
              <tbody>
                {result.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.size}</td>
                    {costPrice && <td>{item.costPrice}</td>}
                    <td>{item.salePrice}</td>
                    {costPrice && <td>{item.profit}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {submitted && (
        <div className="d-flex justify-content-center my-3">
          <button
            className="fancy-button no-print"
            onClick={handlePrintSummary}
          >
            <span className="button_top">Print</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;
