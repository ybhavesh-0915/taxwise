import React from 'react'
import { Upload } from 'lucide-react';
import { FileChartColumn, ChartLine, Brain } from 'lucide-react';
import Toast from '../Function/Toast';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import BullRun from '../Assets/BullRun.gif'


import '../CSS/Upload.css'

const Uploads = () => {
    const navigate = useNavigate();
    const [file, setFile] = React.useState(null);
    const [data, setData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const handleFile = (e) => {
        let file = e.target.files[0]
        setFile(file)
        handleUpload(file)
    }

    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("files", file);

        try {
            setIsLoading(true)
            const response = await fetch("https://web-production-556a5.up.railway.app/process-files", {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json",
                }
            });

            if (response.ok) {
                const data = await response.json();
                setData(data)
                setIsLoading(false)
            }

        }
        catch (error) {
            Toast("error", "Something Went Wrong")
            setIsLoading(false)
            console.error("Error uploading file:", error);
        }
    };


    return (
        <div className='upload'>
            <Toaster />
            <div className="upload-icon">
                <Upload size={60} color='#93a2b7' />
            </div>

            {
                file == null ?
                    <>
                        <h2>Upload your financial data</h2>
                        <p>Drag and drop your CSV file here, or browse to upload<br />We support standard CSV formats.</p>
                        <input type="file" id='file-upload' accept='.csv' onChange={handleFile} />
                        <label htmlFor="file-upload">Browse Files</label>
                    </>
                    :
                    <>
                        <span className='filename'><FileChartColumn size={25} />{file.name}</span>
                        {isLoading ?
                            <div className='process'>
                                <section className='process-img'>
                                    <img src={BullRun} alt="bullrun" />
                                </section>
                                <h3>Processing Your Data...</h3>
                            </div>
                            :
                            <div className="btn-cont">
                                <button type="button" className='proceed-btn' onClick={() => {navigate('/response', {state:{data}})}}>View Analysis</button>
                                <button type="button" className='cancel-btn' onClick={() => { setFile(null); setData(null) }}>Cancel</button>
                            </div>
                        }
                    </>
            }

        </div>
    )
}

export default Uploads