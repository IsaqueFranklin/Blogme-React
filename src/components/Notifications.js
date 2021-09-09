import React, { useContext, useEffect, useState} from 'react'
import { withRouter, Link } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import FirebaseContext from '../firebase/context'
import { Container, Card, Row, Col } from 'react-bootstrap'


function Notifications(props) {

    const { firebase, user } = useContext(FirebaseContext)
    const [users, setUsers] = useState("")


    useEffect(() => {
        getUser();
    }, [])


    function getUser() {
        if (user) {
          return firebase.db.collection('users').doc(user.uid).get().then(doc => {
            setUsers({...doc.data(), id: doc.id})
          })
        } else {
          props.history.push('/')
        }
    }


    return !users ? (
        <div>Loading...</div>
      ) : (
        <Container>
            {users.notifications.map((item, index) => (
                    <Card key={index} className="cardposts">
                        <Card.Body>
                            <Row>
                                <Col md='auto'>
                                    <img src={item.by.photo} alt="user photo" style={{width: 70, height: 70, borderRadius: '50%'}} />
                                </Col>

                                <Col md='auto'>
                                    <small>{distanceInWordsToNow(item.created)} ago</small>
                                    <p>{item.note}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
            ))}
        </Container>
    )
}

export default withRouter(Notifications)
