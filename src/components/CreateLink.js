import React, { useContext, useState } from 'react'
import useFormValidation from '../authentication/useFormValidation'
import validateCreateLink from '../authentication/validateCreateLink'
import FirebaseContext from '../firebase/context'
import { Form, Card } from 'react-bootstrap'
import CenteredContainer from '../authentication/CenteredContainer'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


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


    function handleCreateLink() {
        if (!user) {
            props.history.push('/login')
        } else {
            const { title, thumbImg } = values
            const newPost = {
                title,
                text: textComment,
                thumbImg,
                postedBy: {
                    id: user.uid,
                    name: user.displayName
                },
                voteCount: 0,
                votes: [],
                comments: [],
                created: Date.now()
            }
            firebase.db.collection('posts').add(newPost)
            props.history.push('/')
        }
    }


    return (
        <CenteredContainer>
        <Card className="midia">
            <Card.Body className="midia2">
            <h2 className="titulo">Criando seu link</h2>
            <Form onSubmit={handleCreateLink} className="flex flex-column">

                <Form.Group id="Post">
                    <Form.Label>Title of the post</Form.Label>
                    <Form.Control
                    onChange={handleChange}
                    values={values.title}
                    name="title"
                    placeholder="Descrição do seu link"
                    autoComplete="off"
                    type="text"
                    className={errors.title && 'error-input'} />
                </Form.Group>
                {errors.title && <p className="error-text">{errors.title}</p>}
                <Form.Group id="thumb">
                    <Form.Label>Post Thumb</Form.Label>
                    <Form.Control
                    onChange={handleChange}
                    values={values.thumbImg}
                    name="thumbImg"
                    placeholder="Aqui vai seu link"
                    autoComplete="off"
                    type="text"
                    className={errors.thumbImg && 'error-input'} />
                </Form.Group>
                {errors.thumbImg && <p className="error-text">{errors.thumbImg}</p>}
                <br></br>
                <Form.Group id="content">
                    <Form.Label>Content</Form.Label>
                    <CKEditor
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
            </Card.Body>
        </Card>
        </CenteredContainer>
    )
}

export default CreateLink
