import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../firebase/context'
import { withRouter } from 'react-router-dom'
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
    

    useEffect(() => {
        getFeed();
    }, [user])

    function getFeed() {
        if (user?.uid) {
            return firebase.db.collection('posts').where('whosFeed', 'array-contains', user?.uid).limit(20).get().then(snapshot => {
                const post = snapshot.docs.map(doc => {
                    return { id: doc.id, ...doc.data()}
                })
                setPosts(post)
            })
        } else {
            return null
        }
    }

    function getFeedPosts() {
        firebase.db.collection('posts').where('whosFeed', 'array-contains', user?.uid).get().then(snapshot => {
            const post = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data()}
            })
            setPosts(post)
        })
    }

    return !posts ? (
        <Container style={{justifyContent: 'center', alignItems: 'center'}} className="cont">
          <img src="https://i.stack.imgur.com/ATB3o.gif" alt="loading" style={{justifySelf: "center", alignItems: 'center', marginTop: 200, marginLeft: 40}} />
        </Container>
      ) : (
        <>
        <Container className="">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Blogme</title>
                <meta name="description" content="Start your blog today and free your toughts."></meta>
            </Helmet>
            <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
                <h3 style={{marginTop: 30, marginBottom: 30, marginLeft: 20}}>New posts for you :)</h3>
                {/* renderLinks() ao invés de usar links */}
                {posts.map((post) => (
                    <PostContainer key={post.id} showCount={true} post={post} />
                ))}
                <br></br>
                <br></br>
            </div>
        </Container>
        </>
    )
}

export default withRouter(Feed)
