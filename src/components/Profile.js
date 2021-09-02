import React, { useContext, useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import format from 'date-fns/format'
import FirebaseContext from '../firebase/context'
import { Container, Card, Row, Col } from 'react-bootstrap'
import PostContainer from './PostContainer'
import Footer from './Footer'
import {Helmet} from "react-helmet";
import app from 'firebase/app'


function Profile(props) {
    
    const { firebase, user } = useContext(FirebaseContext)

    const [users, setUsers] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const postId = props.match.params.postId
    const postRef = firebase.db.collection('users').where('email', '==', postId)
    const isTopPage = props.location.pathname.includes('');

  
    useEffect(() => {
      getUser();
      getInitialPosts();
    }, [])

  
    function getUser() {
      return postRef.onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          setUsers({...doc.data(), id: doc.id});
        });
      });
    }


    function getInitialPosts() {
        firebase.db.collection('posts').where('postedBy.email', '==', postId).get().then(snapshot => {
            const posts = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data()}
            })
            setPosts(posts)
        })
    }

    function followUser() {
        if(!user) {
            props.history.push('/login')
        } else {

            /*const followingRef = firebase.db.collection('users').doc(user.uid)
            followingRef.get().then(doc => {
                if (doc.exists) {
                    const alreadyFollowing = doc.data().following;
                    const newFollow = users.id
                    const updatedFollowing = [...alreadyFollowing, newFollow]
                    followingRef.update({ following: updatedFollowing })
                }
            })

            const followersRef = firebase.db.collection('users').doc(users.id)
            followersRef.get().then(doc => {
                if (doc.exists) {
                    const alreadyFollowers = doc.data().followers;
                    const newFollow = user.uid
                    const updatedFollowers = [...alreadyFollowers, newFollow]
                    followersRef.update({ followers: updatedFollowers })
                }
            })*/

            firebase.db.collection('users').doc(user.uid).update({
                following: app.firestore.FieldValue.arrayUnion(users.id)
            })

            firebase.db.collection('users').doc(users.id).update({
                followers: app.firestore.FieldValue.arrayUnion(user.uid)
            })

            
        }
    }


    function unFollowUser() {
        if(!user) {
            props.history.push('/login')
        } else {

            firebase.db.collection('users').doc(user.uid).update({
                following: app.firestore.FieldValue.arrayRemove(users.id)
            })

            firebase.db.collection('users').doc(users.id).update({
                followers: app.firestore.FieldValue.arrayRemove(user.uid)
            })

        }
    }

    return !users ? (
        <div>Loading...</div>
      ) : (
        <>
        <Container className="cont">
            <Helmet>
                <meta charSet="utf-8" />
                <title>{users.blogName}</title>
                <meta name="description" content={`This is the blog of @${users.name} created at ${format(users.created, 'dd/MM/yyyy')}.`}></meta>
            </Helmet>
            <Container>
            <Card className="homecard">
                <Card.Body>
                    <Row>
                    <Col>
                    <small>Since {format(users.created, 'dd/MM/yyyy')}</small>
                    <br></br>
                    {
                    (users.profileImg === "" || users.profileImg === undefined || users.profileImg === null) ?
                    <img src="https://icons-for-free.com/iconfiles/png/512/neutral+user-131964784832104677.png" alt="user" style={{width: 150, height: 150, borderRadius: '50%', alignItems: 'center', marginBottom: 20, marginTop: 20}} /> :
                    <img src={users.profileImg} style={{width: 150, height: 150, borderRadius: '50%', alignItems: 'center', marginBottom: 20, marginTop: 20}} />
                    }
                    <br></br>
                    <h3>{users.blogName} {users.verified == true && <img src="https://img.icons8.com/fluent/48/000000/verified-badge.png" className="verified" />}</h3>
                    <br></br>
                        <Row>
                                <Col md="auto">
                                    <p style={{fontSize: 14}}>{users.followers.length}{"  "}<p style={{fontWeight: "bold", fontSize:14}}>followers</p></p>
                                    
                                </Col>

                                <Col>
                                    <p style={{fontSize: 14}}>{users.following.length}{"  "}<p style={{fontWeight: "bold", fontSize:14}}>following</p></p>
                                    
                                </Col>
                        </Row>
                        <p style={{ padding: 8, maxWidth: 450,}}>{users.bio}</p>
                    <br></br>
                    {
                    (users.followers?.includes(user?.uid)) 
                    ? <button className="unFollowButton" onClick={() => unFollowUser()}>Following<img src="/img/check.png" alt="following" style={{width:14, height:16, marginLeft:3, marginBottom:3}}/></button>
                    : <button className="followButton" onClick={() => followUser()}>Follow</button>
                    }
                    </Col>
                    <Col md="auto">
                    {user && users.email == user.email ? <a href={`/profile/${users.email}`}><button className="unFollowButton">Edit profile</button></a> : null}
                    </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Container>
            <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
                {posts.map((post) => (
                    <PostContainer key={post.id} showCount={true} post={post} />
                ))}
                <br></br>
                <br></br>
            </div>
        </Container>
        <Footer />
        </>
    )
}

export default withRouter(Profile);
