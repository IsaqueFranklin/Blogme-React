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


            firebase.db.collection('users').doc(users.id).get().then(doc => {
                if(doc.exists){
                  const previous = doc.data().notifications
                  const comment = {
                    by: { id: user.uid, name: user.displayName, userId: user.uid },
                    created: Date.now(),
                    userId: user.uid,
                    note: `${user.displayName} está te seguindo agora.`,
                    visto: false,
                  }
                  const updatedComments = [...previous, comment]
                  firebase.db.collection('users').doc(users.id).update({ notifications: updatedComments })
                }
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
            <Container className="">
            <Card className="homecard3">
                <Card.Body>
                    <Row>
                    <Col>
                    <div className="back" style={{backgroundImage: (users.coverImg === "" || users.coverImg === undefined || users.coverImg === null) ? 'url(https://icoconvert.com/images/noimage2.png)' : `url(${users.coverImg})`}}>
                        <br></br>
                        {
                        (users.profileImg === "" || users.profileImg === undefined || users.profileImg === null) ?
                        <img src="https://icons-for-free.com/iconfiles/png/512/neutral+user-131964784832104677.png" alt="user" style={{width: 150, height: 150, borderRadius: '50%', alignItems: 'center', marginBottom: 20, marginTop: 20}} /> :
                        <img src={users.profileImg} style={{width: 150, height: 150, borderRadius: '50%', alignItems: 'center', marginTop: 80, marginLeft: 20, justifyContent: 'center'}} />
                        }
                    </div>
                    <br></br>
                    <h3 style={{marginLeft: 20, marginTop: 50}}>{users.blogName} {users.verified == true && <img src="https://img.icons8.com/fluent/48/000000/verified-badge.png" className="verified" />}</h3>
                    <small style={{marginLeft: 20}}>Since {format(users.created, 'dd/MM/yyyy')}</small>
                    <br></br>
                        <Row style={{marginLeft: 10, marginTop: 30}}>
                                <Col md="auto">
                                    <p style={{fontSize: 14}}>{users.followers.length}{"  "}<p style={{fontWeight: "bold", fontSize:14}}>followers</p></p>
                                    
                                </Col>

                                <Col>
                                    <p style={{fontSize: 14}}>{users.following.length}{"  "}<p style={{fontWeight: "bold", fontSize:14}}>following</p></p>
                                    
                                </Col>
                        </Row>
                        <p style={{ padding: 8, maxWidth: 450, marginLeft: 10}}>{users.bio}</p>
                    <br></br>
                    {
                    (users.followers?.includes(user?.uid)) 
                    ? <button style={{marginLeft: 20}} className="unFollowButton" onClick={() => unFollowUser()}>Following<img src="/img/check.png" alt="following" style={{width:14, height:16, marginLeft:3, marginBottom:3}}/></button>
                    : <button style={{marginLeft: 20}} className="followButton" onClick={() => followUser()}>Follow</button>
                    }
                    {user && users.email == user.email ? <a href={`/profile/${users.email}`}><button className="unFollowButton" style={{marginLeft: 20}}>Edit profile</button></a> : null}
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
