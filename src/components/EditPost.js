import React, { useContext, useEffect, useState} from 'react'
import { Link, withRouter } from 'react-router-dom'
import FirebaseContext from '../firebase/context'
import { Container, Form } from 'react-bootstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'



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
                title: title,
                text: text,
                thumbImg: thumbImg,
            })
            props.history.push('/')
        }
    }

    function handleTitle(e) {
        if(e.target.value){
            setTitle(e.target.value)
        } else {
            setTitle(post.title)
        }
    }

    return (
        <Container>
            <br></br>
            <br></br>
            <Form onSubmit={handleEdit}  className="flex flex-column">

                <Form.Group id="Post">
                    <h3>Editing your title</h3>
                    <br></br>
                    <Form.Label>Copy your title to the box below or add a new one:</Form.Label>
                    <br></br>
                    <p>{post.title}</p>
                    <Form.Control
                    placeholder="copy your current title here or write a new one"
                    onChange={handleTitle}
                    />
                </Form.Group>
                <br></br>
                <hr></hr>
                <br></br>
                <Form.Group id="thumb">
                    <h3>Editing your thumb url</h3>
                    <br></br>
                    <Form.Label>Copy your thumb url to the box below or add a new one:</Form.Label>
                     <Form.Control
                    value={post.thumbImg}
                    />
                    <br></br>
                    <Form.Control
                    placeholder="copy your current thumb url here or add a new one"
                    onChange={e => setThumbImg(e.target.value)}
                    />
                </Form.Group>
                <br></br>
                <hr></hr>
                <br></br>
                <Form.Group id="content">
                    <h3>Editing your content</h3>
                    <br></br>
                    <Form.Label>Feel free to edit it:</Form.Label>
                    <br></br>
                    <CKEditor
                    style={{ height: 400, }}
                    className=""
                    editor={ ClassicEditor }
                    data={post.text}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setText(data);
                    }}
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
