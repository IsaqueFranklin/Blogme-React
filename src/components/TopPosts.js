import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../firebase/context'
import PostContainer from './PostContainer'
import { Container, Card, Row, Col } from 'react-bootstrap'
import Footer from './Footer'

function TopPosts(props) {

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
        <Container className="cont">
        <Container  className="cont">
          <br></br>
          <br></br>
          <h3><small>Best ranked posts of the day by number of stars</small></h3>
          <br></br>
        </Container>
          <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
            {/* renderLinks() ao invés de usar links */}
            {posts.map((post) => (
              <PostContainer key={post.id} showCount={true} post={post} />
            ))}
          </div>
          <Container>
          <Card className="homecard">
            <Card.Body>
              <br></br>
              <h4>Wanna see the recent posts?</h4>
              <p>You wanna see what people are posting and commenting right now?</p>
              <a href="/"><button>Recent posts</button></a>
            </Card.Body>
          </Card>
          </Container>
        </Container>
        <Footer />
      </>
    )
}

export default TopPosts