import React, { useContext} from 'react'
import { Link, withRouter } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import FirebaseContext from '../firebase/context'
import { Form, Card, Button, Alert, Container } from 'react-bootstrap'

function PostContainer({ post, showCount, history }) {
    
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
                    voteRef.update({ votes : updatedVotes, voteCount })
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
            <Card className="links cardColor">
            <Card.Body>
            <div className="flex items-start mt2">
                <div className="">
                        <div className="">
                            {showCount && <span className="gray"></span>}
                            <h5 className="title">{post.title}</h5>
                            {" "}
                            <small>by {post.postedBy.name}</small>
                            {/*<span className="link">({getDomain(link.url)})</span>*/}
                            <br></br>
                            <small className="paragraph">{post.voteCount} likes</small>{" "}
                            <small>{distanceInWordsToNow(post.created)} ago</small>
                        </div>
                        <div className="social">
                            <span className="like" onClick={handleVote}>like</span>{"  "}
                            <Link to={`/post/${post.id}`} className="link">
                                {post.comments.length > 0
                                ? `${post.comments.length} comentários`
                                : "Ver comentários"}
                            </Link>
                            {postedByAuthUser && (
                                <>
                                {" "}
                                <span className="delete-button" onClick={handleDeleteLink}>
                                    Excluir
                                </span>
                                </>
                            )}
                        </div>
                </div>
            </div>
        </Card.Body>
        </Card>
    </Container>
    )
}

export default withRouter(PostContainer);