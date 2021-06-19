import React, { useContext, useEffect, useState} from 'react'
import { withRouter } from 'react-router-dom'
import distanceInWordsToNow from 'date-fns/formatDistanceToNow'
import FirebaseContext from '../firebase/context'
import { Container } from 'react-bootstrap'
import Post from './Post'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'


function ReadPost(props) {
    
    const { firebase, user } = useContext(FirebaseContext)
    const [post, setPost] = useState(null)
    const [commentText, setCommentText] = useState("")
    const postId = props.match.params.postId
    const postRef = firebase.db.collection('posts').doc(postId)
  
    useEffect(() => {
      getPost()
    }, [])
  
    function getPost() {
      postRef.get().then(doc => {
        setPost({...doc.data(), id: doc.id})
      })
    }

    function handleAddComment() {
        if (!user) {
          props.history.push('/login')
        } else {
          postRef.get().then(doc => {
            if(doc.exists){
              const previousComments = doc.data().comments
              const comment = {
                postedBy: { id: user.uid, name: user.displayName },
                created: Date.now(),
                text: commentText
              }
              const updatedComments = [...previousComments, comment]
              postRef.update({ comments: updatedComments })
              setPost(prevState => ({
                ...prevState,
                comments: updatedComments
              }))
              setCommentText("")
            }
          })
        }
      }

    return !post ? (
        <div>Loading...</div>
      ) : (
        <Container>
            <Post post={post} />
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
                <p className="comment-author">
                    {comment.postedBy.name} | {distanceInWordsToNow(comment.created)}
                </p>
                <div dangerouslySetInnerHTML={{ __html: comment.text }} />
                <hr></hr>
                <br></br>
                </div>
            ))}
        </div>
        </Container>
    )
}

export default withRouter(ReadPost);
