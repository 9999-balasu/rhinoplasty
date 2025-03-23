import React from "react";

const Slider = ({ onChange }: { onChange: (value: number) => void }) => {
  return (
    <div>
      <label htmlFor="intensity">Intensity: </label>
      <input
        id="intensity"
        type="range"
        min="0"
        max="100"
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4"
      />
    </div>
  );
};

export default Slider;

