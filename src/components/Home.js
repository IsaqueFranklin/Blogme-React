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
        .orderBy('follows', 'desc')
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
                 <Card className="homecard" key={user.id}>
                 <Card.Body>
                 <Row>
                     <Col>
                     <h4>{user.blogName} {user.verified == true && <img src="https://img.icons8.com/fluent/48/000000/verified-badge.png" className="verified" />}</h4>
                    <p>@{user.name}</p>
                    <small>Since {format(user.created, 'dd/MM/yyyy')}</small>
                     </Col>
                     <Col md="auto">
                         <a href={`/${user.email}`}><button>See more</button></a>
                         <br></br>
                         <br></br>
                         <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAADE0lEQVRIic2Uv28cRRTHP2/P5nbWjm9nnZ07giUMSiwUCxCgFAQFBURQivwJaWhooUCicSJL0NBAqKLQQERQUGgipaBIiShAAoTiNAeSQ0GIf+BbJ2fnSHLzUtxi3V2W3BlhiSetNHrz/b7Pm9mZgf9rhNadCa07s6OQcuJeN9apsU7LiTuyHW+wLbEy1zWe3xFQGNdeAQ4Ba/l3MM/9tyCR9kkAVflIlVN57sTQ/mFEJnEHUb4FsrLeeSILAm90ZBFIFH251Vj5ZlCNoVYkvvM/VPkwy7KMtbWbqnzcKSBzD3fnNYrgYaX6uJZ0X6A6o8jTAm8CWcjd6UajsQ5gra20GL0GxAqfCHrFi9SlLb+01pd+A3wvaGrKRJt33lV4RpUZgb1AuZ+uKida2dL73bkwrs6J6HsFzf6l8KsIdfX83IqjD2QsSY96la/7hNdB64rURagH6NWNtZXLQLtPVxpL0iMeme00qTMgM8Ceni0SjgKMGusu5hexFca1wwUdbivCuHbYWNfKa14ERrc6M9Z9kU9kJnEv/ltIVNn9grHuT2Odmth91Q3phn2ew5rbuYx/h7Hupci69U6N6oUiyBYssu5sDtsIK9VXh4WENj1krLvZ8aZfAiODPD2w8kS6d5ChPJHuM9ZtGOs0su4sUOrXFF3Y9mZj+Q1gEYgkKE0NAklQegyIgMXc2386H/oy1ABG7nF1EGi0HSzkw0f5h2etEFSeSJ8EDMpSs3ljZRDo1q3rqwjLQFiuuOmhQaUg2J/P9qwmmqwdMDa9ZGx6KZqsHeizLQCURGaHBnnxuVivADwyOfmUsdUL6v13IMdAjqn330exuzwWu2c7Wlno9fZG4REUZD+AKBtR4j5Tz3HQEtAU0VMAqvK2Cq8p/BAl7hzqf1dky/tgzYIw1v0IPNeVuqvwaVDy85urq38A7Nq1Z/e9kfY7oG8BYZf2p9uN5eeHBTWBMaAtwjnvg/lWduNakTaMa9NB4OdVOU7n/mzcbiyPF2kfNFt32tj0/HhSK9zvohhParPGpudD604P69mRuA8RiAEixdfBEAAAAABJRU5ErkJggg==" className="star" /> {user.follows.length} stars</p>
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
    <br></br>
    <Footer />
    </>
    )
}

export default Home
