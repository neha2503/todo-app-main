var firebaseConfig = {
  apiKey: "AIzaSyBG2mDrEUxFjwGJALQaYCOniZsQzT_k5cc",
  authDomain: "todo-pro-2e9e8.firebaseapp.com",
  projectId: "todo-pro-2e9e8",
  storageBucket: "todo-pro-2e9e8.appspot.com",
  messagingSenderId: "939822496371",
  appId: "1:939822496371:web:37178819d1e064afd18806",
  measurementId: "G-2PQJC71HHP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//const database = firebase.firestore();
