import React, { useContext, useEffect, useState } from 'react'
import FirebaseContext from '../firebase/context'
import PostContainer from './PostContainer'
import CenteredContainer from '../authentication/CenteredContainer'

const LINKS_PER_PAGE = 10;

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
        <CenteredContainer>
        <div>
            <h5>Blogme</h5>
            <br></br>
            <p>Start your blog today and free your toughts</p>
            <br></br>
        </div>
        <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
      {/* renderLinks() ao invés de usar links */}
      {posts.map((post) => (
        <PostContainer key={post.id} showCount={true} post={post} />
      ))}
    </div>
    </CenteredContainer>
    )
}

export default Home
