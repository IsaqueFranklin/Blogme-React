import React, { useContext, useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import format from 'date-fns/format'
import FirebaseContext from '../firebase/context'
import { Container, Card, Row, Col } from 'react-bootstrap'
import PostContainer from './PostContainer'
import Footer from './Footer'


function Profile(props) {
    
    const { firebase, user } = useContext(FirebaseContext)
    const [users, setUsers] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [filteredPosts, setFilteredPosts] = useState([])
    const [filter, setFilter] = useState("")
    const postId = props.match.params.postId
    const postRef = firebase.db.collection('users').where('email', '==', postId)
    const isTopPage = props.location.pathname.includes('');
  
    useEffect(() => {
      getUser();
      getInitialPosts();
    }, [])
  
    function getUser() {
      postRef.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setUsers({...doc.data(), id: doc.id});
        });
      });
    }

    function getInitialPosts() {
        firebase.db.collection('posts').where('postedBy.email', '==', postId).get().then(snapshot => {
            const posts = snapshot.docs.map(doc => {
                return { id: doc.id, ...doc.data()}
            })
            setPosts(posts)
        })
    }

    function handleVote() {
        if(!user) {
            props.history.push('/login')
        } else {
            const voteRef = firebase.db.collection('users').doc(users.id)
            voteRef.get().then(doc => {
                if (doc.exists) {
                    const previousVotes = doc.data().follows;
                    const vote = { follows: { id: user.uid, name: user.displayName, email: user.email }}
                    const updatedVotes = [...previousVotes, vote]
                    const voteCount = updatedVotes.length
                    voteRef.update({ follows : updatedVotes, voteCount }).then(() => {window.location.reload()})
                }
            })
        }
    }

    return !users ? (
        <div>Loading...</div>
      ) : (
        <>
        <Container className="cont">
            <Container>
            <Card className="homecard">
                <Card.Body>
                    <Row>
                    <Col>
                    <small>Since {format(users.created, 'dd/MM/yyyy')}</small>
                    <h3>{users.blogName}</h3>
                    <h5>@{users.name}</h5>
                    <br></br>
                    <p style={{ backgroundColor: '#091116', color: '#fff', padding: 8, maxWidth: 450, borderRadius: 6}}>{users.bio}</p>
                    <br></br>
                    <p><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAADE0lEQVRIic2Uv28cRRTHP2/P5nbWjm9nnZ07giUMSiwUCxCgFAQFBURQivwJaWhooUCicSJL0NBAqKLQQERQUGgipaBIiShAAoTiNAeSQ0GIf+BbJ2fnSHLzUtxi3V2W3BlhiSetNHrz/b7Pm9mZgf9rhNadCa07s6OQcuJeN9apsU7LiTuyHW+wLbEy1zWe3xFQGNdeAQ4Ba/l3MM/9tyCR9kkAVflIlVN57sTQ/mFEJnEHUb4FsrLeeSILAm90ZBFIFH251Vj5ZlCNoVYkvvM/VPkwy7KMtbWbqnzcKSBzD3fnNYrgYaX6uJZ0X6A6o8jTAm8CWcjd6UajsQ5gra20GL0GxAqfCHrFi9SlLb+01pd+A3wvaGrKRJt33lV4RpUZgb1AuZ+uKida2dL73bkwrs6J6HsFzf6l8KsIdfX83IqjD2QsSY96la/7hNdB64rURagH6NWNtZXLQLtPVxpL0iMeme00qTMgM8Ceni0SjgKMGusu5hexFca1wwUdbivCuHbYWNfKa14ERrc6M9Z9kU9kJnEv/ltIVNn9grHuT2Odmth91Q3phn2ew5rbuYx/h7Hupci69U6N6oUiyBYssu5sDtsIK9VXh4WENj1krLvZ8aZfAiODPD2w8kS6d5ChPJHuM9ZtGOs0su4sUOrXFF3Y9mZj+Q1gEYgkKE0NAklQegyIgMXc2386H/oy1ABG7nF1EGi0HSzkw0f5h2etEFSeSJ8EDMpSs3ljZRDo1q3rqwjLQFiuuOmhQaUg2J/P9qwmmqwdMDa9ZGx6KZqsHeizLQCURGaHBnnxuVivADwyOfmUsdUL6v13IMdAjqn330exuzwWu2c7Wlno9fZG4REUZD+AKBtR4j5Tz3HQEtAU0VMAqvK2Cq8p/BAl7hzqf1dky/tgzYIw1v0IPNeVuqvwaVDy85urq38A7Nq1Z/e9kfY7oG8BYZf2p9uN5eeHBTWBMaAtwjnvg/lWduNakTaMa9NB4OdVOU7n/mzcbiyPF2kfNFt32tj0/HhSK9zvohhParPGpudD604P69mRuA8RiAEixdfBEAAAAABJRU5ErkJggg==" className="star" /> {users.follows.length} stars</p>
                    {user && users.email == user.email 
                    ? <p>This is your profile</p> 
                    : <small onClick={handleVote}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAABmJLR0QA/wD/AP+gvaeTAAADE0lEQVRIic2Uv28cRRTHP2/P5nbWjm9nnZ07giUMSiwUCxCgFAQFBURQivwJaWhooUCicSJL0NBAqKLQQERQUGgipaBIiShAAoTiNAeSQ0GIf+BbJ2fnSHLzUtxi3V2W3BlhiSetNHrz/b7Pm9mZgf9rhNadCa07s6OQcuJeN9apsU7LiTuyHW+wLbEy1zWe3xFQGNdeAQ4Ba/l3MM/9tyCR9kkAVflIlVN57sTQ/mFEJnEHUb4FsrLeeSILAm90ZBFIFH251Vj5ZlCNoVYkvvM/VPkwy7KMtbWbqnzcKSBzD3fnNYrgYaX6uJZ0X6A6o8jTAm8CWcjd6UajsQ5gra20GL0GxAqfCHrFi9SlLb+01pd+A3wvaGrKRJt33lV4RpUZgb1AuZ+uKida2dL73bkwrs6J6HsFzf6l8KsIdfX83IqjD2QsSY96la/7hNdB64rURagH6NWNtZXLQLtPVxpL0iMeme00qTMgM8Ceni0SjgKMGusu5hexFca1wwUdbivCuHbYWNfKa14ERrc6M9Z9kU9kJnEv/ltIVNn9grHuT2Odmth91Q3phn2ew5rbuYx/h7Hupci69U6N6oUiyBYssu5sDtsIK9VXh4WENj1krLvZ8aZfAiODPD2w8kS6d5ChPJHuM9ZtGOs0su4sUOrXFF3Y9mZj+Q1gEYgkKE0NAklQegyIgMXc2386H/oy1ABG7nF1EGi0HSzkw0f5h2etEFSeSJ8EDMpSs3ljZRDo1q3rqwjLQFiuuOmhQaUg2J/P9qwmmqwdMDa9ZGx6KZqsHeizLQCURGaHBnnxuVivADwyOfmUsdUL6v13IMdAjqn330exuzwWu2c7Wlno9fZG4REUZD+AKBtR4j5Tz3HQEtAU0VMAqvK2Cq8p/BAl7hzqf1dky/tgzYIw1v0IPNeVuqvwaVDy85urq38A7Nq1Z/e9kfY7oG8BYZf2p9uN5eeHBTWBMaAtwjnvg/lWduNakTaMa9NB4OdVOU7n/mzcbiyPF2kfNFt32tj0/HhSK9zvohhParPGpudD604P69mRuA8RiAEixdfBEAAAAABJRU5ErkJggg==" className="star" /> Give it a star, baby!</small>
                    }
                    </Col>
                    <Col md="auto">
                    {user && users.email == user.email ? <a href={`/profile/${users.email}`}><button>Edit profile</button></a> : <button>Instagram</button>}
                    </Col>
                    </Row>
                </Card.Body>
            </Card>
            </Container>
            <br></br>
            <div style={{ opacity: loading ? 0.25 : 1}} className="fundo2">
                {posts.map((post) => (
                    <PostContainer key={post.id} showCount={true} post={post} />
                ))}
                <br></br>
                <br></br>
            </div>
        </Container>
        <Footer />
        </>
    )
}

export default withRouter(Profile);
