const NavBar = () => {
    return(
        <div>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark px-2">
            <a className="navbar-brand" href="#">rw-stockapp</a>
            {/*
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            */}
            <div className="collapse navbar-collapse" id="navbarsExample04">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://www.twse.com.tw/zh/holidaySchedule/holidaySchedule">市場開休市</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://www.twse.com.tw/zh/page/trading/exchange/TWTAVU.html">減資預告表</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://www.twse.com.tw/zh/page/announcement/notice.html">注意股</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://www.twse.com.tw/zh/page/announcement/punish.html">處置股</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" target="_blank" href="https://www.twse.com.tw/zh/page/trading/exchange/TWT48U.html">除權息</a>
                    </li>
                </ul>
                {/* 
                <form className="form-inline my-2 my-md-0">
                    <input className="form-control" type="text" placeholder="Search"></input>
                </form>
                */}
            </div>
        </nav>
        </div>
    )
}

export default NavBar
