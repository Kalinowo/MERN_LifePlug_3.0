import React from "react";

export default function Button({
  children,
  onClick,
  width,
  height,
  fontSize,
  lineHeight,
}) {
  return (
    <>
      <button
        className="customButton"
        style={{
          width: width,
          height: height,
          fontSize: fontSize,
          lineHeight: lineHeight,
        }}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
}
