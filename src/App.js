import React, { useState, useEffect } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import GlobalStyle from './styles/global';
import { Container, Content } from './styles/styles';

import Upload from './components/Upload';
import FileList from './components/FileList';

import api from './services/api';

export default function App(){
    const [uploadFiles, setUploadFiles] = useState([]);

    useEffect(() => {
        loadUploadFiles()
    }, []);

    async function loadUploadFiles(){
        try {
            const response = await api.get('/uploads');

            setUploadFiles((state) => {
                let arr = [];
                response.data.map(file => {
                    arr.push({
                        id: file._id,
                        name: file.name,
                        readableSize: filesize(file.size),
                        preview: file.url,
                        uploaded: true,
                        url: file.url,
                        progress: 100
                    });
                });

                return arr;
            });
            
        } catch(error){
            console.log(error.response.data.error)
        }
    }

    function handleUploads(files){
        const data = files.map(file => ({
            file, 
            id: uniqueId(),
            name: file.name,
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false, 
            error: false,
            url: null,
        }));

        setUploadFiles(uploadFiles.concat(data));
        
        data.map(index => processUpload(index));
    }

    async function processUpload(files){       
        const data = new FormData();

        data.append('file', files.file);

        try {
            const response = await api.post('/uploads', data, {
                onUploadProgress: e => {
                    const progress = parseInt(Math.round(e.loaded * 100 / e.total));
    
                    setUploadFiles((state) =>  {
                        let arr = [...state];
                        state.map((index, key) => {
                            if(index.id == files.id){
                                arr[key].progress = progress;
                            }
                        })
                        return arr;
                    }); 
    
                }
            });
        
            setUploadFiles((state) =>  {
                let arr = [...state];
                state.map((index, key) => {
                    if(index.id == files.id){
                        arr[key].url = response.data.url;
                        arr[key].id = response.data._id;
                        arr[key].uploaded = true;
                    }
                })
                return arr;
            });
           

        } catch(err){
            setUploadFiles((state) =>  {
                let arr = [...state];
                state.map((index, key) => {
                    if(index.id == files.id) arr[key].error = true;
                })
                return arr;
            });
            
        }
        
    }

    async function handleDelete(id){
        try {
            await api.delete(`/uploads/${id}`);
            
            let newArr;
            setUploadFiles((state) =>  newArr = state.filter(file => file.id !== id) );
            setUploadFiles(newArr);
        } catch(err){
            console.log(err.response.data.error)
        }
    }

    return (
        <Container>
            <Content>
                <Upload onUpload={e => handleUploads(e)} />
                <FileList files={uploadFiles} onDelete={handleDelete} />
            </Content>
            <GlobalStyle />
        </Container>
    );
}
