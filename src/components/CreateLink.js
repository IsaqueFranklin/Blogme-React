import React, { useContext, useState, useEffect } from 'react'
import useFormValidation from '../authentication/useFormValidation'
import validateCreateLink from '../authentication/validateCreateLink'
import FirebaseContext from '../firebase/context'
import { Form, Container } from 'react-bootstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Helmet} from "react-helmet";
import app from 'firebase/app'


const INITIAL_STATE = {
    text: "",
    title: "",
    thumbImg: ""
}

function CreateLink(props) {

    const { firebase, user } = useContext(FirebaseContext)

    const { handleSubmit, handleChange, values, errors } = useFormValidation(INITIAL_STATE, validateCreateLink, handleCreateLink)
    const [textComment, setTextComment] = useState("")
    const [titlePost, setTitlePost] = useState("")
    const [coverImg, setCoverImg] = useState("")
    const [myUser, setMyUser] = useState([])


    useEffect(() => {
        getMyUser();
    }, [user])


    function getMyUser() {
        if (user) {
          return firebase.db.collection('users').where('email', '==', user?.email).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setMyUser({...doc.data(), id: doc.id});
            });
          });
        } else {
          return null;
        }
    }


    function handleCreateLink() {
        if (!user) {
            props.history.push('/login')
        } else {
            const { title, thumbImg } = values

            const newPost = {
                uid: user.uid,
                title,
                text: textComment,
                thumbImg,
                postedBy: {
                    id: user.uid,
                    name: user.displayName,
                    email: user.email
                },
                voteCount: 0,
                votes: [],
                comments: [],
                created: Date.now(),
                whosFeed: myUser?.followers,
            }
            firebase.db.collection('posts').add(newPost).then(function(docRef) {
                firebase.db.collection('users').doc(user.uid).update({
                    posts: app.firestore.FieldValue.arrayUnion(docRef.id)
                })
            })

            props.history.push('/')
        }
    }


    return (
        <Container>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Create</title>
                <meta name="description" content="In the process of creating a post."></meta>
            </Helmet>
            <br></br>
            <br></br>
            <h2 className="titulo">Publishing your post</h2>
            <br></br>
            <Form onSubmit={handleCreateLink} className="flex flex-column">

                <Form.Group id="Post">
                    <Form.Label>Title of the post</Form.Label>
                    <Form.Control
                    onChange={handleChange}
                    values={values.title}
                    name="title"
                    placeholder="title"
                    autoComplete="off"
                    type="text"
                    className={errors.title && 'error-input'} />
                </Form.Group>
                {errors.title && <p className="error-text">{errors.title}</p>}
                <br></br>
                <Form.Group id="thumb">
                    <Form.Label>Post Thumb Url</Form.Label>
                    <Form.Control
                    onChange={handleChange}
                    values={values.thumbImg}
                    name="thumbImg"
                    placeholder="Post image Url"
                    autoComplete="off"
                    type="text"
                    className={errors.thumbImg && 'error-input'} />
                </Form.Group>
                {errors.thumbImg && <p className="error-text">{errors.thumbImg}</p>}
                <br></br>
                <Form.Group id="content">
                    <Form.Label>Content</Form.Label>
                    <CKEditor
                    style={{ height: 400, }}
                    className=""
                    editor={ ClassicEditor }
                    data={textComment}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        setTextComment(data);
                    }}
                    />
                </Form.Group>
                {errors.text && <p className="error-text">{errors.text}</p>}
                <br></br>
                <button className="" type="submit">
                    Publish
                </button>
            </Form>
        </Container>
    )
}

export default CreateLink
