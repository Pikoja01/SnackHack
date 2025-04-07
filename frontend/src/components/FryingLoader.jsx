import React from "react";
import FryingPanSVG from "../assets/FryingPanLoader.svg";

export default function FryingLoader() {
  return (
    <div className="flex justify-center items-center py-10 animate-fadeIn">
      <img src={FryingPanSVG} alt="Cooking..." className="w-32 h-32" />
    </div>
  );
}