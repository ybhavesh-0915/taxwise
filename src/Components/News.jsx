import React from 'react'
import { Newspaper, CalendarDays, ExternalLink } from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';
import '../CSS/News.css'

const News = () => {
    const [newsArticle, setNewsArticle] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const news = async () => {
        try {
            setIsLoading(true)
            const news = await fetch('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=91103de558874a7ba608e8c4e99ea8d4')
            const response = await news.json()
            setNewsArticle(response.articles)
            setIsLoading(false)
        }
        catch (e) {
            setIsLoading(false)
            console.log(e);
        }

    }
    React.useEffect(() => {
        news();
        setIsLoading(true)
    }, [])
    return (
        <div className='news'>
            <div className="sec-title">
                <Newspaper size={30} />
                <h2>Finance News</h2>
            </div>

            <div className="news-cont">
                {isLoading ?
                    <>
                        <CircularProgress size="30px" />
                    </>
                    :
                    <>
                        {
                            newsArticle.map((article, idx) => {
                                return (
                                    <div className="new-card" key={idx}>
                                        <h3>{article.title}</h3>
                                        <p>{article.description}</p>
                                        <div className="news-bottom">
                                            <div className="left">
                                                <CalendarDays size={12} />{article.publishedAt.split('T')[0]}
                                            </div>
                                            <div className="right">
                                                <a href={article.url} target='_blank'><ExternalLink size={15} /></a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </>
                }
            </div>
        </div >
    )
}

export default News