import React from 'react'
import { WithRouter, NavLink, withRouter } from 'react-router-dom'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FirebaseContext } from '../firebase'
import './header.css'


function Header() {

    const {user, firebase} = React.useContext(FirebaseContext)

    return (
            <Navbar collapseOnSelect variant="light" fixed='top' expand="lg" sticky="top" style={{backgroundColor: "#fff"}}>
            <Navbar.Brand href="#home">
                <img src="" alt="" className="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/">Hacker News Brasil</Nav.Link>
                <Nav.Link href="/">Recentes</Nav.Link>
                <Nav.Link href="/top">Top</Nav.Link>
                <Nav.Link href="/search">Pesquisar</Nav.Link>
                {user && (
                    <>
                        <Nav.Link href="/create" className="header-link">
                        Criar link
                        </Nav.Link>
                    </>
                    )}

                {user ? (
                    <>
                        <NavDropdown title={user.displayName} id="collasible-nav-dropdown">
                        <NavDropdown.Item>{user.displayName}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={() => firebase.logout()}>Sair</NavDropdown.Item>
                        <NavDropdown.Item href="/profile">Perfil</NavDropdown.Item>
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