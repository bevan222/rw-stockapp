const Footer = () => {
    var today = new Date()
    return(
        <footer className = "navbar-fixed-bottom bg-dark text-light py-2">
            <div className="container text-center">
                &copy; {today.getFullYear()} <a href="https://rw-stockapp.web.app/" class="">rw-stockapp</a>
                <br />
                <span className="small text-muted">V{process.env.REACT_APP_VERSION}  </span>
                Powered By <a href="https://github.com/bevan222" target="_blank" className="" rel="noopener">Bevan</a>
                &nbsp;
                <a href = "mailto: bevan2628@gmail.com">聯絡我</a>            
            </div>
        </footer>
    )
}

export default Footer
