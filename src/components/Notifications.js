import React, { useContext, useEffect, useState} from 'react'
import { withRouter, Link } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import FirebaseContext from '../firebase/context'
import { Container, Card, Row, Col } from 'react-bootstrap'


function Notifications(props) {

    const { firebase, user } = useContext(FirebaseContext)
    const [users, setUsers] = useState(null)


    useEffect(() => {
        getUser();
    }, [user])


    function getUser() {
        if (user?.uid) {
            return firebase.db.collection('users').doc(user?.uid).get().then(doc => {
                setUsers({...doc.data(), id: doc.id})
            })
        } else {
            return null
        }
    }

    /*function handleVisto(index) {
        return firebase.db.collection('users').doc(user.uid).get().then(doc => {
            if(doc.exists){
              const previous = doc.data().notifications
              
              const updated = [...previous]
              const rightIndex = updated[index]
              
              firebase.db.collection('users').doc(post?.postedBy.id).update({ notifications: updatedComments })
            }
          })
    }*/


    return !users ? (
        <Container style={{justifyContent: 'center', alignItems: 'center'}} className="cont">
          <img src="https://i.stack.imgur.com/ATB3o.gif" alt="loading" style={{justifySelf: "center", alignItems: 'center', marginTop: 200, marginLeft: 40}} />
        </Container>
      ) : (
        <>
        <Container>
            <h3 style={{marginTop: 30, marginBottom: 20}}>Your notifications :)</h3>
            {users?.notifications?.sort((a, b) => a.created > b.created ? 1:-1).map((item, index) => (
                    <Card key={index} className="cardposts">
                        <Link to={`/post/${item.by.postId}`}>
                        <Card.Body>
                            <Row>
                                <Col md='auto'>
                                    {
                                    (item.by?.photo === "" || item.by?.photo === undefined || item.by?.photo === null) ?
                                    <img src="https://icons-for-free.com/iconfiles/png/512/neutral+user-131964784832104677.png" alt="user" style={{width: 70, height: 70, borderRadius: '50%'}} /> :
                                    <img src={item.by.photo} alt="user photo" style={{width: 70, height: 70, borderRadius: '50%'}} />
                                    }
                                </Col>

                                <Col md='auto'>
                                    <small>{distanceInWordsToNow(item?.created)}</small>
                                    <p>{item.note}</p>
                                </Col>
                            </Row>
                        </Card.Body>
                        </Link>
                    </Card>
            ))}
            <br></br>
            <br></br>
            <br></br>
        </Container>
        </>
    )
}

export default withRouter(Notifications)
