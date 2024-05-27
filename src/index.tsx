import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './components/routes/Routes';
import './index.css';
import * as firebase from 'firebase/app'
import { AuthProvider } from './components/providers/AuthProveder';

firebase.initializeApp({
  apiKey: "AIzaSyCwnB5Cidgjdvw8YjpgmwlXEPy4Ato5mgA",
  authDomain: "my-app-6304b.firebaseapp.com",
  projectId: "my-app-6304b",
  storageBucket: "my-app-6304b.appspot.com",
  messagingSenderId: "548723142797",
  appId: "1:548723142797:web:132b917199ecdac893f2c4"
})

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)