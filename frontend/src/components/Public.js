import { Link } from "react-router-dom"
const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap"> techNotes</span></h1>
            </header>
            <main className="public__main">
                <p>TechNotes App</p>
                <address className="public__addr">
                    Name <br />
                    Address <br />
                    <a href="tel:+911234567890">+91 1234567890</a>
                </address>
                <br />
                <p> Owner : Name</p>
            </main>
            <footer>
                <Link to="/login">Login</Link>
            </footer>
        </section>
    )
    return content
}

export default Public
