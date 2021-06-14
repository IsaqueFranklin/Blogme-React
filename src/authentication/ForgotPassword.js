import React, { useState} from "react";
import FirebaseContext from '../firebase/context'
import { Form, Card, Button, Alert } from 'react-bootstrap'
import CenteredContainer from '../authentication/CenteredContainer'
import { Link } from 'react-router-dom'

function ForgotPassword() {

  const { firebase } = React.useContext(FirebaseContext)
  const [ resetPasswordEmail, setResetPasswordEmail] = useState('')
  const [isPasswordReset, setIsPasswordReset] = useState(false)
  const [ passwordResetError, setPasswordResetError] = useState(null)

  async function handleResetPassword() {
    try {
      await firebase.resetPassword(resetPasswordEmail)
      setIsPasswordReset(true)
      setPasswordResetError(null)
    } catch (err) {
      console.error('Error sending email', err)
      setPasswordResetError(err.message)
      setIsPasswordReset(false)
    }
  }

  return (
        <CenteredContainer>
            <Card className="midia">
                <Card.Body className="midia2">
                    <Form className="flex flex-column">
                    <h2 className="titulo">Esqueceu sua senha?</h2>
                    <Form.Group id="email">
                        <Form.Label>Seu email</Form.Label>
                        <Form.Control
                            type="email"
                            className="input"
                            placeholder="Coloque seu email aqui"
                            onChange={event => setResetPasswordEmail(event.target.value)} />
                    </Form.Group>
                    </Form>
                        <button className="button" onClick={handleResetPassword}>
                            Recuperar senha
                        </button>
                    {isPasswordReset && <p className="input">veja sua caixa de entrada para restaurar senha</p>}
                    {passwordResetError && <p className="error-text">{passwordResetError}</p>}

                    <div className="w-100 text-left mt-3">
                        <Link to="/login">Fazer login</Link>
                    </div>
                </Card.Body>
            </Card>
        </CenteredContainer>
  )
}

export default ForgotPassword;