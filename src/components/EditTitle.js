import React, { useContext, useEffect, useState} from 'react'
import { Link, withRouter } from 'react-router-dom'
import FirebaseContext from '../firebase/context'
import { Container, Form } from 'react-bootstrap'


function EditPost(props) {

    const { firebase, user } = useContext(FirebaseContext)
    const [post, setPost] = useState("")
    const postId = props.match.params.postId
    const postRef = firebase.db.collection('posts').doc(postId)
    const [title, setTitle] = useState("")
    const [thumbImg, setThumbImg] = useState("")
    const [text, setText] = useState("")

    useEffect(() => {
      getPost()
    }, [])
  
    function getPost() {
      postRef.get().then(doc => {
        setPost({...doc.data(), id: doc.id})
      })
    }

    function handleEdit() {
        if(!user) {
            props.history.push('/login')
        } else {
            postRef.update({
                title: title
            })
            props.history.push('/')
        }
    }

    return (
        <Container>
            <br></br>
            <br></br>
            <h2 className="titulo">Editing your title</h2>
            <br></br>
            <Form onSubmit={handleEdit}  className="flex flex-column">

                <Form.Group id="Post">
                     <Form.Control
                    defaultValue={post.title}
                    onChange={e => setTitle(e.target.value)}
                    />
                </Form.Group>
                
                <br></br>
                <button className="" type="submit">
                    Edit post
                </button>
            </Form>
        </Container>
    )
}

export default withRouter(EditPost)