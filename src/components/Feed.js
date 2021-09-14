import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../firebase/context'
import PostContainer from './PostContainer'
import { Container, Card, Row, Col } from 'react-bootstrap'
import Footer from './Footer'
import format from 'date-fns/format'
import {Helmet} from "react-helmet";
import app from 'firebase/app'


function Feed(props) {

    const { firebase, user } = useContext(FirebaseContext)

    const [posts, setPosts] = useState([])
    const [follow, setFollow] = useState([])
    const [loading, setLoading] = useState(false)
    const IsNewPage = props.location.pathname.includes('/home')
    const isTopPage = props.location.pathname.includes('top');

    useEffect(() => {
        getFeed();
        //getFeedPosts();
    }, [])

    function getFeed() {
        firebase.db.collection('users').doc(user?.uid).get().then(doc => {
            setFollow({...doc.data(), id: doc.id})
        })
    }

    function getFeedPosts() {
        firebase.db.collection('users').where('uid', '==', follow).get().then(snapshot => {
            const posts = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data()}
            })
            setPosts(posts)
        })
    }

    




    return (
        <>
        <Container className="">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Blogme</title>
                <meta name="description" content="Start your blog today and free your toughts."></meta>
            </Helmet>
            
        <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
            {/* renderLinks() ao invés de usar links */}
            {follow?.following?.map((user) => (
                <Card className="homecard2" key={user.id}>
                <Card.Body>
                <Row>
                    <Col>
                    {
                   (user.profileImg === "" || undefined || null) ?
                   <img src="https://icons-for-free.com/iconfiles/png/512/neutral+user-131964784832104677.png" alt="user" style={{width: 80, height: 80, borderRadius: '50%', alignItems: 'center', marginBottom: 20, marginTop: 20}} /> 
                   :
                   <img src={user.profileImg} style={{width: 80, height: 80, borderRadius: '50%', alignItems: 'center', marginBottom: 20, marginTop: 20}} />
                   }
                    <h4>{user.blogName} {user.verified == true && <img src="https://img.icons8.com/fluent/48/000000/verified-badge.png" className="verified" />}</h4>
                   <p>@{user.name}</p>
                   <small>Since {format(user.created, 'dd/MM/yyyy')}</small>
                    </Col>
                    <Col md="auto">
                        <a href={`/${user.email}`}><button>See more</button></a>
                        <br></br>
                        <br></br>
                        <p style={{fontSize: 14}}>{user.followers.length}{"  "}<p style={{fontWeight: "bold", fontSize:14}}>followers</p></p>
                    </Col>
                </Row>
                </Card.Body>
            </Card>
            ))}
            <br></br>
            <br></br>
        </div>
        
    </Container>
    <br></br>
    <Footer />
    </>
    )
}

export default Feed
