import React,{useEffect,useState} from 'react'
import { common } from '../../utils/common'

export default function Loader({show}) {
   
    show=common.defaultIfEmpty(show,false);
    const [showModel, setShowModel] = useState(show)
    useEffect(() => {
        debugger;
setShowModel(show);
    }, [show])
    
    if(!showModel)
    return <></>
  return (
    <div className='loader-app'>Loader</div>
  )
}
