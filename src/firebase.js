import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyB6UVPGm6KtOgKBoE1t29S5CM83Bh2uTW4",
    authDomain: "lost-and-found-660fb.firebaseapp.com",
    databaseURL: "https://lost-and-found-660fb.firebaseio.com",
    projectId: "lost-and-found-660fb",
    storageBucket: "lost-and-found-660fb.appspot.com",
    messagingSenderId: "594999693108",
    appId: "1:594999693108:web:07195cf987b042901e1f61",
    measurementId: "G-H6R4CTHNXK"
};

firebase.initializeApp(config);
export default firebase.firestore();
