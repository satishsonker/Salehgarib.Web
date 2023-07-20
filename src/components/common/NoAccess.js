import React from 'react'

export default function NoAccess() {
  return (
    <>
    <div className='text-center text404'><span>401</span></div>
    <div className='text-center'><img style={{width:'150px'}} src='assets/images/icons/scissor.png'/> </div>
    <div className='text-center fs-6 mt-5'><span className='nft'>You Do not have access on this page.</span></div>
    </>
  )
}
