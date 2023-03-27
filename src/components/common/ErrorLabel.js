import React from 'react'

export default function ErrorLabel({message,fontSize='11px'}) {
    if(!message || message==="")
    return <></>
  return (
    <div className='text-danger' style={{position:'absolute',fontSize:fontSize,display:"contents"}}>{message}</div>
  )
}
