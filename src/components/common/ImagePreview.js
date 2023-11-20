import React from 'react'
import { useState } from 'react';
import { common } from '../../utils/common';

export default function ImagePreview({ src, width, size, alt,onClick }) {
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    onClick=common.defaultIfEmpty(onClick,()=>{});
    return (
        <div style={
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: width ? width : "100%",
            }
        } >
            <img src={src} style={
                {
                    display: loading ? "none" : "block",
                    width: "100%",
                    animation: "fadeIn 0.5s",
                    border: '2px solid black',
                    boxShadow: '5px 7px 12px 3px gray',
                    borderRadius: '10px'
                }
            }
                alt={alt}
                onClick={onClick}
                onLoad={(e) => { setLoading(false) }}
                onError={(e) => { e.target.src =common.defaultImageUrl;setErrorMsg("We are unable to download image. either image are not available or not able to download due slow internet") }}></img>
            <div className="spinner" style={{
                display: loading ? "block" : "none",
                fontSize: size ? size : "24px"
            }} ></div>
            {loading && <div className='text-center img-loading-msg'>Please wait...! We are still loading the image.</div>}
            {errorMsg!=="" && <div className='text-center img-error-msg'>{errorMsg}</div>}
        </div>
    )
}