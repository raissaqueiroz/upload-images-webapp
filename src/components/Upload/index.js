import React from 'react';
import Dropzone from 'react-dropzone';

import { DropContainer, UploadMessage } from './styles';

const Upload = ({ onUpload }) => {

    const renderDragMessage = ( isDragActive, isDragReject) => {
        if(!isDragActive)
            return <UploadMessage> Arraste os arquivos aqui...</UploadMessage>
        

        if(isDragReject) 
            return <UploadMessage type="error">Arquivo não suportado</UploadMessage>
        
        return <UploadMessage type="success">Solte os arquivos arqui</UploadMessage>
    }

    return(
        <Dropzone accept="image/*" onDropAccepted={e => onUpload(e)}>
            {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
                <DropContainer 
                    {...getRootProps()} 
                    isDragActive={isDragActive}
                    isDragReject={isDragReject}
                >
                    <input {...getInputProps()} />
                    { renderDragMessage(isDragActive, isDragReject) }
                </DropContainer>
            )}
        </Dropzone>
    );
}

export default Upload;