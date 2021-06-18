import React, { useState } from 'react'
import useFormValidation from './useFormValidation'
import validateLogin from './validateLogin'
import { Link } from 'react-router-dom'
import firebase from '../firebase/'
import { Form, Card, Button, Alert } from 'react-bootstrap'
import CenteredContainer from '../authentication/CenteredContainer'

const INITIAL_STATE = {
    name: "",
    email: "",
    password: "",
    blogName: "",
}


function Login(props) {

    const { handleChange, handleSubmit, handleBlur, errors, isSubmitting, values } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser)
    const [login, setLogin] = useState(true)
    const [firebaseError, setFirebaseError] =  useState(null)
    const [username, setUsername] =  useState(null)

    async function authenticateUser() {
        const { name, email, password, blogName } = values
        
        try {
            login
                ? await firebase.login(email, password)
                : await firebase.register(name, email, password, blogName)
            props.history.push('/')
        } catch(err) {
            console.error('Erro de autenticação', err)
            setFirebaseError(err.message)
        }
    }


    return (
    <CenteredContainer>
      <Card className="midia">
        <Card.Body className="midia2">
          <h2 className="titulo">{login ? "Login" : "Crie sua conta"}</h2>
          <Form onSubmit={handleSubmit} className="flex flex-column">
            <Form.Group id="name">
              {!login && (
                <>
                <Form.Label>Your name</Form.Label>
                <Form.Control
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                type="text"
                placeholder="your name"
                autoComplete="off"
                name="name" 
                className="input" />
                {errors.name && <p className="error-text">{errors.name}</p>}
                <br></br>
                <Form.Label>your blog's name</Form.Label>
                <Form.Control
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.blogName}
                type="text"
                placeholder="blog name"
                autoComplete="off"
                name="blogName" 
                className="input" />
                </>
                )}
            </Form.Group>

            <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                type="email"
                placeholder="your email"
                autoComplete="off"
                name="email"
                className={errors.email ? 'error-input' : "input"} />
            </Form.Group>
            {errors.email && <p className="error-text">{errors.email}</p>}

            <Form.Group id="password">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                type="password"
                placeholder="chose a secure password"
                name="password"
                className={errors.password ? "error.input" : "input"} />
            </Form.Group>
            {errors.password && <p className="error-text">{errors.password}</p>}
            {firebaseError && <p className='error-text'>{firebaseError}</p>}

            <button type="submit" className="" disbaled={isSubmitting}>
                    Entrar
                </button>
                <button type="button" className="" onClick={() => setLogin(prevLogin => !prevLogin)}>
                    {login ? "Ainda não tem uma conta?" : "Já tem uma conta?"}
                </button>
          </Form>
          <div className="w-100 text-left mt-3">
            <Link to="/forgot">Esqueci minha senha</Link>
          </div>
        </Card.Body>
      </Card>
    </CenteredContainer>
    )
}

export default Login
