import React, { useState } from "react";
import ClothContext from "./ClothContext";

const ClothState = (props) => {
  const [result, setResult] = useState([]);
  const [costPrice, setCostPrice] = useState(false); // Admin toggle
  const [withGST, setWithGST] = useState(false); // GST toggle (only active if Admin is on)
  const [salePrice, setSalePrice] = useState("");

  const sizeData = [
    { label: 20, actual: 105 },
    { label: 22, actual: 90 },
    { label: 24, actual: 95 },
    { label: 26, actual: 105 },
    { label: 28, actual: 105 },
    { label: 30, actual: 105 },
    { label: 32, actual: 105 },
    { label: 34, actual: 105 },
    { label: 36, actual: 105 },
    { label: 38, actual: 105 },
    { label: 40, actual: 105 },
    { label: 42, actual: 105 },
  ];

  const calculate = (type, price, embroideryCharges, extraCharges) => {
    const formattedType = type?.trim().toLowerCase();

    if (
      !["half-shirt", "full-shirt", "pant", "coat", "skirt", "lower"].includes(
        formattedType
      )
    ) {
      setResult([]);
      return;
    }

    const prices = sizeData.map((item) => {
      let base = (item.actual / 100) * parseFloat(price || 0);

      if (embroideryCharges) {
        base += parseFloat(embroideryCharges || 0);
      }

      if (extraCharges) {
        base += parseFloat(extraCharges || 0);
      }

      const gstAmount = base * 1.4 * 0.05;
      const sale = base * 1.4;

      const priceObj = {
        size: item.label,
      };

      if (costPrice) {
        priceObj.costPrice = base.toFixed(2);
        priceObj.salePrice = withGST
          ? (sale + gstAmount).toFixed(2)
          : sale.toFixed(2);
        priceObj.profit = (parseFloat(priceObj.salePrice) - base).toFixed(2);
      } else {
        priceObj.salePrice = sale.toFixed(2);
      }

      return priceObj;
    });

    setResult(prices);
  };

  return (
    <ClothContext.Provider
      value={{
        calculate,
        result,
        withGST,
        setWithGST: (val) => {
          // GST can only be enabled if Admin is active
          if (costPrice) {
            setWithGST(val);
          } else {
            setWithGST(false);
          }
        },
        costPrice,
        setCostPrice: (val) => {
          setCostPrice(val);
          if (!val) {
            setWithGST(false); // Disable GST if Admin is off
          }
        },
      }}
    >
      {props.children}
    </ClothContext.Provider>
  );
};

export default ClothState;
