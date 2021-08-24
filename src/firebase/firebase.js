import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import firebaseConfig from './config'

class Firebase {
    constructor() {
        app.initializeApp(firebaseConfig);
        this.auth = app.auth()
        this.db = app.firestore()
    }

    async register(name, email, password, blogName){
        const newUser = await  this.auth.createUserWithEmailAndPassword(
            email, password
        )

        if(newUser.user.uid){
            const newPost = {
                bio: "",
                blogName: blogName,
                name: name,
                email: email,
                profileImg: "",
                created: Date.now(),
                followCount: 0,
                pro: false,
                verified: false,
                followers: [],
                following: [],
                comments: [],
                posts: []
            }
            await firebase.db.collection('users').doc(newUser.user.uid).set(newPost)
        }

        return await newUser.user.updateProfile({
            displayName: name,
            blogName: blogName
        })
    }

    async login(email, password) {
        return await this.auth.signInWithEmailAndPassword(email, password)
    }

    async logout(){
        await this.auth.signOut()
    }

    async resetPassword(email){
        await this.auth.sendPasswordResetEmail(email)
    }
}

const firebase = new Firebase()

export default firebase;