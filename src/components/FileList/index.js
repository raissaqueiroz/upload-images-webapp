import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md';

import { Container, FileInfo, Preview } from './styles';

export default function FileList({ files, onDelete }){

    return (
        <Container>
            {console.log('files')}
            {console.log(files)}
            
            {files.length > 0 && files.map(index => (
                <li key={index.id}>
                    <FileInfo>
                        <Preview src={index.preview} />
                        <div>
                            <strong>{index.name}</strong>
                            <span>{index.readableSize}{" "} 
                            { index.url && ( <button onClick={() => onDelete(index.id)}>Excluir</button> ) }
                            </span>
                        </div>

                    </FileInfo>
                    <div>
                        {index.progress !== 100 && !index.error && (
                            <CircularProgressbar
                                styles={{
                                    root: { width: 24 },
                                    path: { stroke: '#7159c1'}
                                }}

                                strokeWidth={10}
                                value={index.progress}
                            />
                        )}

                        {index.url && !index.error && (
                            <a href={index.url} target="_blank" rel="noopener noreferrer">
                                <MdLink style={{ marginRight: 8}} size={24} color="#222" />
                            </a>
                        )}
                        
                        {index.progress === 100 && (<MdCheckCircle size={24} color="#78e5d4" /> )}
                        {index.error && ( <MdError size={24} color="#e57878" /> )}
                        

                    </div>
                </li>
            ))}
            
        </Container>
    )
}


