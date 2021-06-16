import React, { useContext} from 'react'
import { Link, withRouter } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import FirebaseContext from '../firebase/context'
import { Form, Card, Button, Alert, Container } from 'react-bootstrap'

function Post({ post, showCount, history }) {
    
    const { firebase, user } = useContext(FirebaseContext)

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
                    voteRef.update({ votes : updatedVotes, voteCount }).then(() => {window.location.reload()})
                }
            })
        }
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
            <br></br>
            <br></br>
            <h3>{post.title}</h3>
            <br></br>
            <img src={post.thumbImg} alt="" />
            <br></br>
            <span className="like" onClick={handleVote}>like</span>
            <br></br>
            <small>By {post.postedBy.name}</small>
            <br></br>
            <small>{distanceInWordsToNow(post.created)} ago</small>
            <br></br>
            <p>{post.voteCount} likes</p>
            <br></br>
            <div dangerouslySetInnerHTML={{ __html: post.text }} />
            <br></br>
            <br></br>
            <p>{post.comments.length} comments</p>
            <br></br>
            {postedByAuthUser && (
            <>
              <span className="delete-button" onClick={handleDeleteLink}>
                delete
              </span>
            </>
          )}
          <br></br>
          <br></br>
        </Container>
    )
}

export default withRouter(Post);