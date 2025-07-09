import React, { memo } from 'react';

const Label = memo(({
  text,
  helpText,
  isRequired = false,
  className = "",
  fontSize = "12px",
  bold = false,
  isUpperCase = false,
  width = "auto"
}) => {
  const labelStyle = {
    fontSize,
    fontWeight: bold ? 'bold' : undefined,
    width,
  };

  const labelClass = `${className}${isUpperCase ? ' text-uppercase' : ''}`;

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
});

Label.displayName = 'Label';

export default Label;
