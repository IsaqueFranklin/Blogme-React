import React from 'react'
import { withRouter } from 'react-router-dom'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FirebaseContext } from '../firebase'
import './header.css'


function Header() {

    const {user, firebase} = React.useContext(FirebaseContext)

    return (
            <Navbar collapseOnSelect variant="light" fixed='top' expand="lg" sticky="top" style={{backgroundColor: "#fff"}}>
            <Navbar.Brand href="/">
                <img src="/img/montanhas.png" alt="logo" className="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/">Blogme</Nav.Link>
                <Nav.Link href="/top">Top</Nav.Link>
                <Nav.Link href="/search">Search</Nav.Link>
                {user && (
                    <>
                        <Nav.Link href="/create" className="header-link">
                        Create
                        </Nav.Link>
                    </>
                    )}

                {user ? (
                    <>
                        <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
                        <NavDropdown.Item href={`/${user.email}`}>My profile</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/notifications">My notifications</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => firebase.logout()}>Logout</NavDropdown.Item>
                </NavDropdown>
                    </>
                    ) : <Nav.Link href="/login" className="header-link">
                    login
                    </Nav.Link>}
                </Nav>
            </Navbar.Collapse>
            </Navbar>
    )
}

export default withRouter(Header);