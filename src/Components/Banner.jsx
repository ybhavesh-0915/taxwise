import React from 'react'
import { FileChartColumn, ChartLine, Brain } from 'lucide-react';
import BannerImg from '../Assets/BannerImg.png'
import '../CSS/Banner.css'

const Banner = () => {
    return (
        <div className='banner'>
            <div className="left">
                <h1>
                    Welcome to
                    <span style={{ color: '#13375e' }}>Tax</span>
                    <span style={{ color: '#ffd700' }}>Wise</span>
                </h1>
                <h3>Your AI-powered personal finance platform for smarter financial decisions</h3>
                <div className="banner-button">
                    <button><FileChartColumn size={25} />CSV/PDF analysis</button>
                    <button><ChartLine size={25} />Interactive Chart</button>
                    <button><Brain size={25} />AI Insight</button>
                </div>
            </div>

            <div className="right">
                <div className="banner-img-container">
                    <img src={BannerImg} alt="banner" />
                </div>
            </div>

        </div>
    )
}

export default Banner