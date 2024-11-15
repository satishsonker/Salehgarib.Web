import React from 'react'

export default function DisplayLabel({
  headingText,
  contentText,
  helpText,
  isRequired = false,
  headingClass = "",
  contentClass = "",
  headingfontSize = "13px",
  conentfontSize = "inherit",
  headingBold = false,
  contentBold = false,
  width = '100%' }) {
  return (
    <div>
      <label className={headingClass} style={{ fontSize: headingfontSize, fontWeight: headingBold ? 'bold' : '', width: width }}>{headingText} {isRequired && <strong className='text-danger'>*</strong>}</label>
      {helpText !== undefined && helpText !== "" && <i title={helpText} data-toggle="tooltip" style={{ cursor: "pointer" }} className="bi bi-patch-question-fill"></i>}
      <label className={contentClass} style={{ fontSize: conentfontSize, fontWeight: contentBold ? 'bold' : '', width: width }}>{contentText}</label>
    </div>
  )
}
