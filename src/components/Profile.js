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
    const [myUser, setMyUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [filteredPosts, setFilteredPosts] = useState([])
    const [filter, setFilter] = useState("")
    const postId = props.match.params.postId
    const postRef = firebase.db.collection('users').where('email', '==', postId)
    const isTopPage = props.location.pathname.includes('');
  
    useEffect(() => {
      getUser();
      getInitialPosts();
    }, [])
  
    function getUser() {
      postRef.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
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
                    <h3>{users.blogName} {users.verified == true && <img src="https://img.icons8.com/fluent/48/000000/verified-badge.png" className="verified" />}</h3>
                    <h5>@{users.name}</h5>
                    <br></br>
                    <p style={{ backgroundColor: '#091116', color: '#fff', padding: 8, maxWidth: 450, borderRadius: 6}}>{users.bio}</p>
                    <br></br>
                    <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAADE0lEQVRIic2Uv28cRRTHP2/P5nbWjm9nnZ07giUMSiwUCxCgFAQFBURQivwJaWhooUCicSJL0NBAqKLQQERQUGgipaBIiShAAoTiNAeSQ0GIf+BbJ2fnSHLzUtxi3V2W3BlhiSetNHrz/b7Pm9mZgf9rhNadCa07s6OQcuJeN9apsU7LiTuyHW+wLbEy1zWe3xFQGNdeAQ4Ba/l3MM/9tyCR9kkAVflIlVN57sTQ/mFEJnEHUb4FsrLeeSILAm90ZBFIFH251Vj5ZlCNoVYkvvM/VPkwy7KMtbWbqnzcKSBzD3fnNYrgYaX6uJZ0X6A6o8jTAm8CWcjd6UajsQ5gra20GL0GxAqfCHrFi9SlLb+01pd+A3wvaGrKRJt33lV4RpUZgb1AuZ+uKida2dL73bkwrs6J6HsFzf6l8KsIdfX83IqjD2QsSY96la/7hNdB64rURagH6NWNtZXLQLtPVxpL0iMeme00qTMgM8Ceni0SjgKMGusu5hexFca1wwUdbivCuHbYWNfKa14ERrc6M9Z9kU9kJnEv/ltIVNn9grHuT2Odmth91Q3phn2ew5rbuYx/h7Hupci69U6N6oUiyBYssu5sDtsIK9VXh4WENj1krLvZ8aZfAiODPD2w8kS6d5ChPJHuM9ZtGOs0su4sUOrXFF3Y9mZj+Q1gEYgkKE0NAklQegyIgMXc2386H/oy1ABG7nF1EGi0HSzkw0f5h2etEFSeSJ8EDMpSs3ljZRDo1q3rqwjLQFiuuOmhQaUg2J/P9qwmmqwdMDa9ZGx6KZqsHeizLQCURGaHBnnxuVivADwyOfmUsdUL6v13IMdAjqn330exuzwWu2c7Wlno9fZG4REUZD+AKBtR4j5Tz3HQEtAU0VMAqvK2Cq8p/BAl7hzqf1dky/tgzYIw1v0IPNeVuqvwaVDy85urq38A7Nq1Z/e9kfY7oG8BYZf2p9uN5eeHBTWBMaAtwjnvg/lWduNakTaMa9NB4OdVOU7n/mzcbiyPF2kfNFt32tj0/HhSK9zvohhParPGpudD604P69mRuA8RiAEixdfBEAAAAABJRU5ErkJggg==" className="star" />  stars</p>
                    {
                    (users.followers?.includes(user?.uid)) 
                    ? <button onClick={() => unFollowUser()}>Following</button>
                    : <button onClick={() => followUser()}>Follow</button>
                    }
                    </Col>
                    <Col md="auto">
                    {user && users.email == user.email ? <a href={`/profile/${users.email}`}><button>Edit profile</button></a> : <a href={users.instagram}><button>Instagram</button></a>}
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
