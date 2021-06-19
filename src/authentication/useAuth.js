import React, { useEffect, useState } from 'react'
import firebase from '../firebase/firebase'

function useAuth() {

    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        const unsubscibre = firebase.auth.onAuthStateChanged(user => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        })

        return () => unsubscibre()
    }, [])

    return authUser
}

export default useAuth;