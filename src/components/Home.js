import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../firebase/context'
import PostContainer from './PostContainer'
import { Container, Card, Row, Col } from 'react-bootstrap'
import Footer from './Footer'
import format from 'date-fns/format'
import {Helmet} from "react-helmet";


function Home(props) {

    const { firebase } = useContext(FirebaseContext)
    const [posts, setPosts] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const IsNewPage = props.location.pathname.includes('/home')
    const isTopPage = props.location.pathname.includes('top');

    useEffect(() => {
        getLinks();
        getUsers();
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

    function getUsers() {
        return firebase.db
        .collection('users')
        .orderBy('created', 'desc')
        .limit(8)
        .onSnapshot(handleSnapshot2)
    }

    function handleSnapshot2(snapshot){
        const links = snapshot.docs.map(doc => {
            return { id: doc.id, ...doc.data() }
          })
          setUsers(links)
          setLoading(false)
    }

    function handleSnapshot(snapshot) {
        const links = snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() }
        })
        setPosts(links)
        setLoading(false)
    }

    return (
        <>
        <Container className="">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Blogme</title>
                <meta name="description" content="Start your blog today and free your toughts."></meta>
            </Helmet>
            <Container>
            <Card className="homecard">
                <Card.Body>
                <h3>This is Blogme</h3>
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
        <Container className="cont">
        <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
            <h3>Best ranked blog profiles by stars</h3>
            {users.map((user) => (
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
        </div>
        </Container>
    <Container>
        <p>Do you wanna see the best ranked posts?</p>
        <a href="/top"><button>See top posts</button></a>
        <br></br>
        <br></br>
        <br></br>
        <Card className="align-items-center justify-content-center cardhomefinal">
            <Card.Body>
            <br></br>
            <Row>
                <Col>
                <img src='/img/icon.png' alt="" className="blogmelogo" style={{marginBottom: 20, height: 200, width: 200}} />
                <br></br>
                <br></br>
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
    <br></br>
    <Footer />
    </>
    )
}

export default Home
