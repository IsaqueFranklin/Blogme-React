import React, { useContext, useState, useEffect } from 'react'
import FirebaseContext from '../firebase/context'
import { Form, Card, Container } from 'react-bootstrap'
import PostContainer from './PostContainer'
import {Helmet} from "react-helmet";


function Search() {

    const { firebase } = useContext(FirebaseContext)
    const [filteredPosts, setFilteredPosts] = useState([])
    const [filter, setFilter] = useState("")
    const [posts, setPosts] = useState([])


    useEffect(() => {
        getInitialPosts()
    }, [])


    function getInitialPosts() {
        firebase.db.collection('posts').get().then(snapshot => {
            const posts = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data()}
            })
            setPosts(posts)
        })
    }

    function handleSearch(event) {
        event.preventDefault()
        const query = filter.toLowerCase()
        const matchedPosts = posts.filter(post => {
            return (
                post.title.toLowerCase().includes(query) ||
                post.postedBy.name.toLowerCase().includes(query) 
            )
        })
        setFilteredPosts(matchedPosts)
    }

    return (
        <>
        <Container className="cont">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Search</title>
                <meta name="description" content="Search posts or users."></meta>
            </Helmet>
            <Container className="">
            <br></br>
            <br></br>
            <Card style={{ borderRadius: 10 }}>
                <Card.Body className="midia2">
                <Form onSubmit={handleSearch}>
                    <Form.Label>Search for posts, users or names</Form.Label>
                    <Form.Control
                    onChange={event => setFilter(event.target.value)} 
                    placeholder="Search" />
                    <button>Search</button>
                    <br></br>
                </Form>
            </Card.Body>
        </Card>
        </Container>
        {filteredPosts.map((filteredPost, index) => (
            <PostContainer key={filteredPost.id} showCount={false} post={filteredPost}/>
        ))}
        <br></br>
        <br></br>
        </Container>
        </>
    )
}

export default Search
