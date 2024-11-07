import React from 'react';

export default function Label({
  text,
  helpText,
  isRequired = false,
  className = "",
  fontSize = "12px",  // Default font size set to 12px
  bold = false,
  width = "auto", // Default width set to "inherit"
}) {
  // Define the styles for the label
  const labelStyle = {
    fontSize,
    fontWeight: bold ? 'bold' : undefined,
    width,
  };

  // Determine the className for the label
  const labelClass = className ? className : '';

  return (
    <>
      <label className={labelClass} style={labelStyle}>
        {text}
        {isRequired && <strong className="text-danger">*</strong>}
      </label>

      {helpText && (
        <i
          title={helpText}
          aria-label={helpText}
          data-toggle="tooltip"
          style={{ cursor: "pointer" }}
          className="bi bi-patch-question-fill"
        />
      )}
    </>
  );
}
