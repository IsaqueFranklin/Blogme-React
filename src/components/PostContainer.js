import React, { useContext} from 'react'
import { Link, withRouter } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import FirebaseContext from '../firebase/context'
import { Form, Card, Button, Alert, Container, Row, Col } from 'react-bootstrap'

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
                    const voteCount = updatedVotes.length
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
            <Card className="cardposts left">
            <Row>
            <Col md="auto">
                <img src={post.thumbImg} className="ig" />
            </Col>
            <Col md="auto">
                <Card.Body className="">
                <div className="">
                    <div className="left">
                            <div className="">
                                <h5 className="title">{post.title}</h5>{" "}
                                <small>by {post.postedBy.name}</small>{" | "}
        
                                <small onClick={handleVote}>{post.voteCount} stars  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAADE0lEQVRIic2Uv28cRRTHP2/P5nbWjm9nnZ07giUMSiwUCxCgFAQFBURQivwJaWhooUCicSJL0NBAqKLQQERQUGgipaBIiShAAoTiNAeSQ0GIf+BbJ2fnSHLzUtxi3V2W3BlhiSetNHrz/b7Pm9mZgf9rhNadCa07s6OQcuJeN9apsU7LiTuyHW+wLbEy1zWe3xFQGNdeAQ4Ba/l3MM/9tyCR9kkAVflIlVN57sTQ/mFEJnEHUb4FsrLeeSILAm90ZBFIFH251Vj5ZlCNoVYkvvM/VPkwy7KMtbWbqnzcKSBzD3fnNYrgYaX6uJZ0X6A6o8jTAm8CWcjd6UajsQ5gra20GL0GxAqfCHrFi9SlLb+01pd+A3wvaGrKRJt33lV4RpUZgb1AuZ+uKida2dL73bkwrs6J6HsFzf6l8KsIdfX83IqjD2QsSY96la/7hNdB64rURagH6NWNtZXLQLtPVxpL0iMeme00qTMgM8Ceni0SjgKMGusu5hexFca1wwUdbivCuHbYWNfKa14ERrc6M9Z9kU9kJnEv/ltIVNn9grHuT2Odmth91Q3phn2ew5rbuYx/h7Hupci69U6N6oUiyBYssu5sDtsIK9VXh4WENj1krLvZ8aZfAiODPD2w8kS6d5ChPJHuM9ZtGOs0su4sUOrXFF3Y9mZj+Q1gEYgkKE0NAklQegyIgMXc2386H/oy1ABG7nF1EGi0HSzkw0f5h2etEFSeSJ8EDMpSs3ljZRDo1q3rqwjLQFiuuOmhQaUg2J/P9qwmmqwdMDa9ZGx6KZqsHeizLQCURGaHBnnxuVivADwyOfmUsdUL6v13IMdAjqn330exuzwWu2c7Wlno9fZG4REUZD+AKBtR4j5Tz3HQEtAU0VMAqvK2Cq8p/BAl7hzqf1dky/tgzYIw1v0IPNeVuqvwaVDy85urq38A7Nq1Z/e9kfY7oG8BYZf2p9uN5eeHBTWBMaAtwjnvg/lWduNakTaMa9NB4OdVOU7n/mzcbiyPF2kfNFt32tj0/HhSK9zvohhParPGpudD604P69mRuA8RiAEixdfBEAAAAABJRU5ErkJggg==" className="star" /></small>{" "}
                           
                                {" "}<Link to={`/post/${post.id}`} className="">
                                    <button style={{ padding: 8 }}>Read now</button>
                                </Link>
                                {postedByAuthUser && (
                                    <>
                                    {" "}
                                    <span className="delete" onClick={handleDeleteLink}>
                                        Delete
                                    </span>
                                    {" | "}
                                    <Link to={`/edit/${post.id}`}>
                                        Update
                                    </Link>
                                    </>
                                )}
                            </div>
                    </div>
                </div>
                </Card.Body>
            </Col>
        </Row>
        </Card>
    </Container>
    )
}

export default withRouter(PostContainer);