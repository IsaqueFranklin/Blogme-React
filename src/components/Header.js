import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { FirebaseContext } from '../firebase'
import './header.css'


function Header() {

    const {user, firebase} = React.useContext(FirebaseContext)
    const [myUser, setMyUser] = useState("")

    useEffect(() => {
        getMyUser();
    }, [user])
  
    function getMyUser() {
        if (user) {
            return firebase.db.collection('users').where('email', '==', user.email).get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                setMyUser({...doc.data(), id: doc.id});
              });
            });
          } else {
            return null;
        }
    }

    return (
            <Navbar collapseOnSelect variant="light" fixed='top' expand="lg" sticky="top" style={{backgroundColor: "#fff"}}>
            <Navbar.Brand href="/">
                <img src="/img/icon.png" alt="logo" className="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link href="/feed">Home</Nav.Link>
                <Nav.Link href="/">Discover</Nav.Link>
                <Nav.Link href="/top">Top</Nav.Link>
                <Nav.Link href="/search">Search</Nav.Link>

                {user ? (
                    <>
                        <NavDropdown title={
                            <>
                            {
                            (myUser.profileImg === "" || myUser.profileImg === undefined || myUser.profileImg === null) ?
                            <img src="https://icons-for-free.com/iconfiles/png/512/neutral+user-131964784832104677.png" alt="user" style={{width: 30, height: 30, borderRadius: '50%', alignItems: 'center', marginRight: 10}} /> :
                            <img src={myUser.profileImg} style={{width: 30, height: 30, borderRadius: '50%', alignItems: 'center', marginRight: 10 }} />
                            }
                            {user.displayName}
                            </>
                        }>
                            <NavDropdown.Item href={`/${user.email}`}>Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/create">New post</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/notifications">Notifications</NavDropdown.Item>
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