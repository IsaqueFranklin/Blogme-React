import React, { useContext, useState, useEffect} from 'react'
import { Link, withRouter } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import format from 'date-fns/format'
import FirebaseContext from '../firebase/context'
import { Container, Card } from 'react-bootstrap'
import {Helmet} from "react-helmet";


function Post({ post, showCount, history }) {
    
    const { firebase, user } = useContext(FirebaseContext)
    const [users, setUsers] = useState("")
    const [myUser, setMyUser] = useState("")


    useEffect(() => {
        getUser();
        getMyUser();
    }, [])

    function getMyUser() {
        if (user) {
          return firebase.db.collection('users').where('email', '==', user.email).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setMyUser({...doc.data(), id: doc.id});
            });
          });
        } else {
          return null;
        }
    }

    function handleVote() {
        if(!user) {
            history.push('/login')
        } else {
            const voteRef = firebase.db.collection('posts').doc(post.id)
            voteRef.get().then(doc => {
                if (doc.exists) {
                    const previousVotes = doc.data().votes;
                    const vote = { votedBy: { id: user.uid, name: user.displayName }}
                    const updatedVotes = [...previousVotes, vote]
                    const voteCount =updatedVotes.length
                    voteRef.update({ votes : updatedVotes, voteCount })
                }
            })

            firebase.db.collection('users').doc(post?.postedBy.id).get().then(doc => {
                if(doc.exists){
                  const previous = doc.data().notifications
                  const comment = {
                    by: { id: user.uid, name: user.displayName, photo: myUser?.profileImg, userId: user.uid },
                    created: Date.now(),
                    userId: user.uid,
                    note: `${user.displayName} curtiu seu post "${post.title}".`,
                    visto: false,
                  }
                  const updatedComments = [...previous, comment]
                  firebase.db.collection('users').doc(post?.postedBy.id).update({ notifications: updatedComments }).then(() => {window.location.reload()})
                }
              })
        }
    }

    function getUser() {
        return firebase.db.collection('users').where('email', '==', post.postedBy.email).onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
              setUsers({...doc.data(), id: doc.id});
            });
          });
      }

    function handleDeleteLink() {
        const linkRef = firebase.db.collection('posts').doc(post.id)
        linkRef.delete().then(() => {
            console.log(`O documento com ID ${post.id} foi deletado.`)
        })
    }


    const postedByAuthUser = user && user.uid === post.postedBy.id

    return (
        <Container className="cont">
            <Helmet title={post.title} url={post.thumbImg} image={post.thumbImg} description={post.title}>
                <meta charSet="utf-8" />
                <title>{post.title}</title>
                <meta name="description" content={`${post.title}, this is a post by ${post.postedBy.name}, enjoy and come back for more :)`} />

                <meta itemprop="name" content="Blogme" />
                <meta itemprop="description" content={`${post.title}, this is a post by ${post.postedBy.name}, enjoy and come back for more :)`} />
                <meta itemprop="image" content={post.thumbImg} />

                <meta property="og:url" content={post.thumbImg} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={`${post.title}, this is a post by ${post.postedBy.name}, enjoy and come back for more :)`} />
                <meta property="og:image" content={post.thumbImg} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={`${post.title}, this is a post by ${post.postedBy.name}, enjoy and come back for more :)`} />
                <meta name="twitter:image" content={post.thumbImg} />
            </Helmet>
            <div className="links">
                <br></br>
                <p>Published {distanceInWordsToNow(post.created)} ago at {format(post.created, 'dd/MM/yyyy')}</p>
                <h3>{post.title}</h3>
                <br></br>
                <p>{
                    (users.profileImg === "" || undefined || null) ?
                    <img src="https://icons-for-free.com/iconfiles/png/512/neutral+user-131964784832104677.png" alt="user" style={{width: 40, height: 40, borderRadius: '50%', alignItems: 'center', marginBottom: 20, marginRight: 10}} /> :
                    <img src={users.profileImg} style={{width: 40, height: 40, borderRadius: '50%', alignItems: 'center', marginBottom: 10, marginRight: 10 }} />
                    } <Link to={`/${post.postedBy.email}`}>{post.postedBy.name}</Link></p>
                <img src={post.thumbImg} alt="" />
                <br></br>
                <br></br>
                <p onClick={handleVote} className="starp" ><img src="data:image/png;base64,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" className="star2" /> {" | "} {post.voteCount} stars  </p>{" "}
            </div>
            <hr></hr>
            <div className="links" dangerouslySetInnerHTML={{ __html: post.text }} />
            <br></br>
            <Card className="homecard links" style={{ backgroundColor: '#091116', color: '#fff'}}>
                <Card.Body>
                    <p>Wanna see more posts from @{post.postedBy.name}?</p>
                    <Link to={`/${post.postedBy.email}`}><button style={{ backgroundColor: '#fff', color: '#091116'}}>See more posts</button></Link>
                </Card.Body>
            </Card>
            <br></br>
            <hr></hr>
            <br></br>
        </Container>
    )
}

export default withRouter(Post);