import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyA6RfaxbGGgkl6WY3EFx4k3VYVNW4RXW6Y",
    authDomain: "class-s-database.firebaseapp.com",
    databaseURL: "https://class-s-database-default-rtdb.firebaseio.com",
    projectId: "class-s-database",
    storageBucket: "class-s-database.appspot.com",
    messagingSenderId: "222242197245",
    appId: "1:222242197245:web:26f4b4d9b45c4b271a3894",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, };