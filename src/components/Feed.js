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
        firebase.db.collection('users').doc(user?.uid).get().then(snapshot => {
            const use = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data().following}
            })
            setFollow(use)
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
            {follow?.map((post) => (
                <p>{post}</p>
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
