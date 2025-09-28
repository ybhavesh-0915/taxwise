import React from 'react'
import { House, Info, Podcast } from 'lucide-react';
import Logo from '../Assets/Logo.png'
import UserIcon from '../Assets/UserImage.webp'
import '../CSS/Header.css'

const Header = () => {
  const [scrollAmt, setScrollAmt] = React.useState(0);
  const headerRef = React.useRef(null)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollAmt(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    return () => { window.removeEventListener("scroll", handleScroll); };
  }, []);

  React.useEffect(() => {
    if (scrollAmt > 2) {
      headerRef.current.style.boxShadow = "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px";
    } else {
      headerRef.current.style.boxShadow = "none";
    }
  }, [scrollAmt])
  return (
    <header ref={headerRef}>
      <div className="left">
        <img src={Logo} alt="logo" />
        <div className="title">
          <span style={{ color: '#13375e' }}>Tax</span>
          &nbsp;
          <span style={{ color: '#ffd700' }}>Wise</span>
        </div>
      </div>
      <div className="mid">
        <a href="#" className="link"><House size={18} />Home</a>
        <a href="#" className="link"><Info size={18} />About</a>
        <a href="#" className="link"><Podcast size={18} />Contact</a>
      </div>
      <div className="right">
        <div className="user-logo">
          <img src={UserIcon} alt="user-img" />
        </div>
      </div>
    </header>
  )
}

export default Header