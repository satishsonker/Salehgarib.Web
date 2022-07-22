import React from 'react'

export default function Label({text,helpText,isRequired=false,className="",fontSize="inherit"}) {
  return (
    <>
    <label className={className} style={{fontSize:fontSize}}>{text} {isRequired && <strong className='text-danger'>*</strong>}</label>
    { helpText!==undefined && helpText!=="" &&  <i title={helpText} style={{cursor:"pointer"}} className="bi bi-patch-question-fill"></i>}
    </>
  )
}
