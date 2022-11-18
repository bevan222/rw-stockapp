import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavBar = () => {
    const [navbarItemOpen, setNavbarItemOpen] = useState(false);

    return(
        <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark px-2">
            <a className="navbar-brand" href="#">rw-stockapp</a>
            <Button
                className="m-2 navbar-toggler"
                onClick={() => setNavbarItemOpen(!navbarItemOpen)}
                aria-controls="navbarList"
                aria-expanded={navbarItemOpen}
            >
                <span className="navbar-toggler-icon"></span>
            </Button>
            <Collapse in={navbarItemOpen}>
                <div className="navbar-collapse" id="navbarList">
                    <ul className="navbar-nav mr-auto">
                        
                        <NavDropdown
                            title="上市資料"
                            menuVariant="dark"
                        >
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.twse.com.tw/zh/holidaySchedule/holidaySchedule">市場開休市</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.twse.com.tw/zh/page/trading/exchange/TWTAVU.html">減資預告表</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.twse.com.tw/zh/page/announcement/notice.html">注意股</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.twse.com.tw/zh/page/announcement/punish.html">處置股</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.twse.com.tw/zh/page/trading/exchange/TWT48U.html">除權息</a>
                            </li>
                        </NavDropdown>
                        <NavDropdown
                            title="上櫃資料"
                            menuVariant="dark"
                        >
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.tpex.org.tw/web/bulletin/trading_date/trading_date.php?l=zh-tw">市場開休市</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.tpex.org.tw/web/stock/exright/decap/decap.php?l=zh-tw">減資預告表</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.tpex.org.tw/web/bulletin/attention_information/trading_attention_information.php?l=zh-tw">注意股</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.tpex.org.tw/web/bulletin/disposal_information/disposal_information.php?l=zh-tw">處置股</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link mx-1" target="_blank" href="https://www.tpex.org.tw/web/stock/exright/preAnnounce/PrePost.php?l=zh-tw">除權息</a>
                            </li>
                        </NavDropdown>
                    </ul>
                    {/* 
                    <form className="form-inline my-2 my-md-0">
                        <input className="form-control" type="text" placeholder="Search"></input>
                    </form>
                    */}
                </div>
            </Collapse>
        </nav>
        </div>
    )
}

export default NavBar
