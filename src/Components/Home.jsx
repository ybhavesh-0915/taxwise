import React from 'react'
import Banner from './Banner'
import Uploads from './Uploads'
import News from './News'
import '../CSS/Home.css'
const Home = () => {
    return (
        <main>
            <Banner />
            <Uploads/>
            <News />
        </main>
    )
}

export default Home