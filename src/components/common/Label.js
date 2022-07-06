import React from 'react'

export default function Label({text,helpText,isRequired=false}) {
  return (
    <>
    <label>{text} {isRequired && <strong className='text-danger'>*</strong>}</label>
    { helpText!==undefined && helpText!=="" &&  <i title={helpText} style={{cursor:"pointer"}} class="bi bi-patch-question-fill"></i>}
    </>
  )
}
