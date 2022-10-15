const Footer = () => {
    var today = new Date()
    return(
        <footer className = "navbar-fixed-bottom bg-dark text-light py-2">
            <div className="container text-center">
                &copy; {today.getFullYear()} <a href="https://rw-stockapp.web.app/" class="">rw-stockapp</a>
                <span className="small text-muted">{process.env.REACT_APP_FUGLE_VERSION}</span>
                <br />
                {/*<a href="https://BizMoney.tw/contact_us" class="">聯絡我們</a>
                |*/}
                Powered By <a href="https://github.com/bevan222" target="_blank" className="" rel="noopener">Bevan</a>            
            </div>
        </footer>
    )
}

export default Footer
