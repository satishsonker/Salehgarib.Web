import React from 'react'

export default function ErrorLabel({message}) {
    if(!message || message==="")
    return <></>
  return (
    <div className='text-danger'>{message}</div>
  )
}
