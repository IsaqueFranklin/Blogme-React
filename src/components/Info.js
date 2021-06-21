import React, { useContext, useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import FirebaseContext from '../firebase/context'
import { Container, Card, Row, Col, Form } from 'react-bootstrap'
import Footer from './Footer'
import {Helmet} from "react-helmet";


function Info(props) {
    
    const { firebase, user } = useContext(FirebaseContext)
    const [users, setUsers] = useState("")
    const postId = props.match.params.postId
    const userRef = firebase.db.collection('users').where('email', '==', postId)
    const userRefId = firebase.db.collection('users').doc(users.id)
    const [displayName, setDisplayName] = useState("")
    const [name, setName] = useState("")
    const [bioText, setBioText] = useState("")
    const [instagram, setInstagram] = useState("")

    useEffect(() => {
      getUser()
    }, [])
  
    function getUser() {
        userRef.get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setUsers({...doc.data(), id: doc.id});
          });
        });
    }


    function handleEdit() {
        if(!user) {
            props.history.push('/login')
        } else {
            const data = {
                blogName: displayName,
                name: name,
                bio: bioText,
                instagram: instagram
            }
            userRefId.update(data)
            props.history.push('/home')
        }
    }


    return (
        <>
        <Container>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Edit profile</title>
                <meta name="description" content="Editing profile"></meta>
            </Helmet>
            <br></br>
            <br></br>
            <Form onSubmit={handleEdit}  className="flex flex-column">

                <Form.Group id="blogName">
                    <h3>Write your new blog name</h3>
                    <br></br>
                    <p>{users.displayName}</p>
                    <Form.Control
                    defaultValue={users.blogName}
                    placeholder="Write your new blog name"
                    onChange={e => setDisplayName(e.target.value)}
                    />
                </Form.Group>
                <br></br>
                <hr></hr>
                <br></br>
                <Form.Group id="username">
                    <h3>Write your new username</h3>
                    <br></br>
                    <Form.Control
                    defaultValue={users.name}
                    placeholder="Write your new username"
                    onChange={e => setName(e.target.value)}
                    />
                </Form.Group>
                <br></br>
                <hr></hr>
                <br></br>
                <Form.Group id="bio">
                    <h3>Write your new Bio</h3>
                    <br></br>
                    <Form.Control
                    defaultValue={users.bio}
                    placeholder="New profile bio"
                    onChange={e => setBioText(e.target.value)}
                    />
                </Form.Group>
                <br></br>
                <hr></hr>
                <br></br>
                <Form.Group id="bio">
                    <h3>Wanna add your instagram account?</h3>
                    <br></br>
                    <Form.Control
                    defaultValue={users.instagram}
                    placeholder="your instagram url"
                    onChange={e => setInstagram(e.target.value)}
                    />
                </Form.Group>
                <button className="" type="submit">
                    Edit profile
                </button>
            </Form>
            <br></br>
            <br></br>
        </Container>
        <Footer />
        </>
    )
}

export default withRouter(Info);