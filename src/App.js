import React from 'react'
import './App.css';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from './authentication/Login'
import ForgotPassword from './authentication/ForgotPassword'
import firebase, { FirebaseContext } from './firebase'
import useAuth from './authentication/useAuth'
import Header from './components/Header'
import CreateLink from './components/CreateLink'
import Home from './components/Home'
import TopPosts from './components/TopPosts'
import ReadPost from './components/ReadPost'
import './styles/style.css'

function App() {

  const user = useAuth()

  return (
    <BrowserRouter>
    <FirebaseContext.Provider value={{ user, firebase }}>
      <div className="app-container">
        <Header />
        <div className="route-container">
          <Switch>
            <Route exact path='/' render={() => <Redirect to='/home' />} />
            <Route path='/login' component={Login} />    
            <Route path='/forgot' component={ForgotPassword} />
            <Route path='/create' component={CreateLink} />
            <Route path='/home' component={Home} />  
            <Route path='/top' component={TopPosts} />
            <Route path='/post/:postId' component={ReadPost} />
          </Switch>
        </div>
      </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
