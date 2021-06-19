import React, { useContext, useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import FirebaseContext from '../firebase/context'
import { Container, Card, Row, Col, Form } from 'react-bootstrap'
import Footer from './Footer'


function EditInfo(props) {
    
    const { firebase, user } = useContext(FirebaseContext)
    const [users, setUsers] = useState("")
    const postId = props.match.params.postId
    const userRef = firebase.db.collection('users').where('email', '==', postId)
    const [displayName, setDisplayName] = useState("")
    const [name, setName] = useState("")
    const [bioText, setBioText] = useState("")

    useEffect(() => {
      getUser()
    }, [])
  
    function getUser() {
        userRef.get().then(doc => {
          setUsers({...doc.data(), id: doc.id})
        })
      }


    function handleEdit() {
        if(!user) {
            props.history.push('/login')
        } else {
            userRef.update({
                displayName: displayName,
                name: name,
                bioText: bioText
            })
            props.history.push('/')
        }
    }


    return (
        <>
        <Container>
            <br></br>
            <br></br>
            <Form onSubmit={handleEdit}  className="flex flex-column">

                <Form.Group id="blogName">
                    <h3>Write your new blog name</h3>
                    <br></br>
                    <Form.Label>Copy your title to the box below or add a new one:</Form.Label>
                    <br></br>
                    <p>{users.displayName}</p>
                    <Form.Control
                    placeholder="copy your current title here or write a new one"
                    onChange={e => setDisplayName(e.target.value)}
                    />
                </Form.Group>
                <br></br>
                <hr></hr>
                <br></br>
                <Form.Group id="username">
                    <h3>Write your new username</h3>
                    <br></br>
                    <Form.Label>Copy your thumb url to the box below or add a new one:</Form.Label>
                     <Form.Control
                    value={users.name}
                    />
                    <br></br>
                    <Form.Control
                    placeholder="copy your current thumb url here or add a new one"
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
                    placeholder="copy your current thumb url here or add a new one"
                    onChange={e => setBioText(e.target.value)}
                    />
                </Form.Group>
                <br></br>
                <button className="" type="submit">
                    Edit profile
                </button>
            </Form>
        </Container>
        <Footer />
        </>
    )
}

export default withRouter(EditInfo);