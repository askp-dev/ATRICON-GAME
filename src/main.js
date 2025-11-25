import { ToadScheduler, SimpleIntervalJob, Task } from "toad-scheduler";

import process from "process";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "atricon-423b8.firebaseapp.com",

  databaseURL: "https://atricon-423b8-default-rtdb.firebaseio.com",

  projectId: "atricon-423b8",

  storageBucket: "atricon-423b8.firebasestorage.app",

  messagingSenderId: "1029798779250",

  appId: "1:1029798779250:web:d944154ac6fe6b26cc25eb",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let open = false;
let dbref = ref(database, "qs");
onValue(dbref, (snapshot) => {
  const data = snapshot.val();
  let grouped_data = Object.groupBy(data, ({ c }) => c);
});

// const startGame = () => {
//   console.log("Game started!");
// };

// const endGame = () => {
//   console.log("Game ended!");
// };

// const scheduler = new ToadScheduler();

// const task = new Task("simple task", () => {
//   set(dbref, !open);
//   open = !open;
// });
// const job = new SimpleIntervalJob({ seconds: 4 }, task);
// scheduler.addSimpleIntervalJob(job);
