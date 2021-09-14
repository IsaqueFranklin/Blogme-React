import React, { useContext, useEffect, useState} from 'react'
import { withRouter, Link } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import FirebaseContext from '../firebase/context'
import { Container } from 'react-bootstrap'
import Post from './Post'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import app from 'firebase/app'

function ReadPost(props) {
    
    const { firebase, user } = useContext(FirebaseContext)
    const [post, setPost] = useState(null)
    const [commentText, setCommentText] = useState("")
    const [users, setUsers] = useState("")
    const postId = props.match.params.postId
    const postRef = firebase.db.collection('posts').doc(postId)
  
    useEffect(() => {
      getPost();
      getUser();
    }, [])
  
    function getPost() {
      postRef.get().then(doc => {
        setPost({...doc.data(), id: doc.id})
      })
    }

    function getUser() {
      if (user) {
        return firebase.db.collection('users').where('email', '==', user.email).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setUsers({...doc.data(), id: doc.id});
          });
        });
      } else {
        return null;
      }
    }

    function handleAddComment() {
        if (!user) {
          props.history.push('/login')
        } else {
          postRef.get().then(doc => {
            if(doc.exists){
              const previousComments = doc.data().comments
              const comment = {
                postedBy: { id: user.uid, name: user.displayName, photo: users.profileImg, email: user.email },
                created: Date.now(),
                text: commentText
              }
              const updatedComments = [...previousComments, comment]
              postRef.update({ comments: updatedComments })
              setPost(prevState => ({
                ...prevState,
                comments: updatedComments
              }))
              //setCommentText("")
            }
          })

          firebase.db.collection('users').doc(post.uid).get().then(doc => {
            if(doc.exists){
              const previous = doc.data().notifications
              const comment = {
                by: { id: user.uid, name: user.displayName, photo: users.profileImg, postId: post.id },
                created: Date.now(),
                postId: post.id,
                comment: commentText,
                note: `Novo comentário de ${user.displayName} no seu post '${post.title}', veja agora.`,
                visto: false,
              }
              const updatedComments = [...previous, comment]
              firebase.db.collection('users').doc(post.uid).update({ notifications: updatedComments })
            }
          })

          setCommentText("")

          /*firebase.db.collection('users').doc(post.uid).update({
              notifications: app.firestore.FieldValue.arrayUnion()
          })*/
        }
      }

    return !post ? (
      <Container style={{justifyContent: 'center', alignItems: 'center'}} className="cont">
        <img src="https://i.stack.imgur.com/ATB3o.gif" alt="loading" style={{justifySelf: "center", alignItems: 'center', marginTop: 200, marginLeft: 40}} />
      </Container>
      ) : (
        <Container>
            <Post post={post} />
            <Container>
            <div className="links">
                <h5 className="paragraph">Escreva seu comentário</h5>
                <br></br>
                <CKEditor
                className="commentEditor"
                editor={ ClassicEditor }
                data={ commentText }
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setCommentText(data);
                }}
                />
                <div>
                    <button className="" onClick={handleAddComment}>
                    Comentar
                    </button>
                </div>
            </div>
          <div className="links">
                <br></br>
                <br></br>
                <h3>{post.comments.length} comments</h3>
                <hr></hr>
                <br></br>
                {post.comments.map((comment, index) => (
                    <div key={index} className="">
                    <p className="comment-author" style={{fontSize: 16, fontWeight: 600}}>
                    <Link to={`/${comment.postedBy.email}`}>{
                        (comment.postedBy.photo === "" || comment.postedBy.photo === undefined || comment.postedBy.photo === null) ?
                        <img src="https://icons-for-free.com/iconfiles/png/512/neutral+user-131964784832104677.png" alt="user" style={{width: 40, height: 40, borderRadius: '50%', alignItems: 'center', marginRight: 10}} /> :
                        <img src={comment.postedBy.photo} style={{width: 40, height: 40, borderRadius: '50%', alignItems: 'center', marginRight: 10 }} />
                      } {comment.postedBy.name} </Link> <small style={{fontSize: 14, fontWeight: 300,}}>| {distanceInWordsToNow(comment.created)} ago</small></p>
                    <div dangerouslySetInnerHTML={{ __html: comment.text }} />
                    <hr></hr>
                    <br></br>
                    </div>
                ))}
            </div>
            </Container>
        </Container>
    )
}

export default withRouter(ReadPost);
