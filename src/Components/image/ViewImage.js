import { useEffect, useState, memo } from 'react';
import { Modal } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

function ViewImage({ images, index, onClose }) {
    let imageUrls = [];
    for (let i = 0; i < images?.length; i++) {
        imageUrls[i] = {
            url: images[i].url
        }
    }
    return (
        <Modal visible={true} transparent={false} style={{ backgroundColor: 'black' }}
            animationType="fade" onRequestClose={() => onClose()}>
            <ImageViewer enablePreload={true} imageUrls={imageUrls} index={index} renderIndicator={() => <></>}/>
        </Modal>
    )
}
export default memo(ViewImage)