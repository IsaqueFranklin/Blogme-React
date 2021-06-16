import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../firebase/context'
import PostContainer from './PostContainer'
import { Container, Card, Row, Col } from 'react-bootstrap'
import Footer from './Footer'


function Home(props) {

    const { firebase } = React.useContext(FirebaseContext)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const IsNewPage = props.location.pathname.includes('/home')
    const isTopPage = props.location.pathname.includes('top');

    useEffect(() => {
        const unsubscibre = getLinks();
        return () => unsubscibre()
    }, [isTopPage])

    function getLinks() {
        if(isTopPage){
          return firebase.db
          .collection('posts')
          .orderBy('voteCount', 'desc')
          /*.limit(LINKS_PER_PAGE)*/
          .onSnapshot(handleSnapshot)
        }
        return firebase.db
        .collection('posts')
        .orderBy('created', 'desc')
        .limit(15)
        .onSnapshot(handleSnapshot)
      }

    function handleSnapshot(snapshot) {
        const links = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() }
        })
        const lastLink = links[links.length -1]
        setPosts(links)
        setLoading(false)
      }


    return (
        <>
        <Container className="">
            <Container>
            <Card className="homecard">
                <Card.Body>
                <h3>this is Blogme</h3>
                <br></br>
                <Row>
                    <Col>
                        <p>Start your blog for free and begin to share what you have to say. Create your own blog, personalize it, and write your posts with freedom of content. Our platform will deliver your posts to new users daily.</p>
                    </Col>
                    <Col md="auto">
                        <a href="/login"><button>Start your blog</button></a>
                    </Col>
                </Row>
                <br></br>
                </Card.Body>
            </Card>
            <hr></hr>
            <h3>Recent posts</h3>
            <br></br>
        </Container>
        <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
            {/* renderLinks() ao invés de usar links */}
            {posts.map((post) => (
                <PostContainer key={post.id} showCount={true} post={post} />
            ))}
            <br></br>
            <br></br>
        </div>
    <Container>
        <p>Do you wanna see best ranked posts?</p>
        <a href="/top"><button>See top posts</button></a>
        <br></br>
        <br></br>
        <br></br>
        <Card className="align-items-center justify-content-center cardhomefinal">
            <Card.Body>
            <br></br>
            <Row>
                <Col>
                <img src='/img/montanhas.png' alt="" className="blogmelogo" />
                <h4>What's Blogme after all?</h4>
                </Col>
                <Col>
                <br></br>
                <br></br>
                <p>We're what we call a blog engine, it's platform where our users create their own blog and build their audience trusting that our SEO strategy will bring more and mores readers each day.</p>
                <a href="/login"><button>Find out</button></a>
                </Col>
            </Row>
            </Card.Body>
        </Card>
    </Container>
    </Container>
    <Footer />
    </>
    )
}

export default Home
