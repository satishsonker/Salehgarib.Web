import React from 'react'

export default function Label({text,isRequired=false}) {
  return (
    <div>{text} {isRequired && <strong className='text-danger'>*</strong>}</div>
  )
}
