import React from 'react'
import ButtonBox from '../common/ButtonBox'

export default function ImageZoomInPopup({ imagePath, title }) {
    return (
        <div className="modal fade" id="image-zoom-in-model" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {imagePath?.indexOf('assets/images/default-image.jpg') > -1 && <div className='text-center text-danger'>You did not uploaded any image for this Kandoora</div>}
                        {imagePath?.indexOf('assets/images/default-image.jpg') === -1 && <img style={{ width: '100%', height: '100%', borderRadius: '4px', border: '2px solid' }} src={imagePath?.replace('thumb_', '')}></img>}
                    </div>
                    <div className="modal-footer">
                        <ButtonBox type="cancel" text="Close" modelDismiss={true} />
                    </div>
                </div>
            </div>
        </div>
    )
}
