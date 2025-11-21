import tmi from "tmi.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyD22CwWlOfU0B54r8XBKFTy218rIM69qJw",
  authDomain: "atricon-423b8.firebaseapp.com",
  databaseURL: "https://atricon-423b8-default-rtdb.firebaseio.com",
  projectId: "atricon-423b8",
  storageBucket: "atricon-423b8.firebasestorage.app",
  messagingSenderId: "1029798779250",
  appId: "1:1029798779250:web:d944154ac6fe6b26cc25eb",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const client = new tmi.Client({
  channels: ["theatriarchy"],
});
let open = false;
let results = { 1: 0, 2: 0, 3: 0, 4: 0 };
let responded = new Set();

let statusRef = ref(database, "status/loading");

let resultsRef = ref(database, "status/results");

onValue(statusRef, (snapshot) => {
  const data = snapshot.val();
  open = data;
  if (open) {
    results = { 1: 0, 2: 0, 3: 0, 4: 0 };
    responded.clear();
    let interval = setTimeout(() => {
      set(statusRef, false);
      set(resultsRef, results);
    }, 60000); // 60 seconds to answer
  }
  console.log("Open status changed:", open);
});

const validate = (message) => {
  const regex = /^[1-4]/;

  if (regex.test(message) && message.length === 1) {
    return message;
  }
  return null;
};

const sortResults = (obj) => {
  return Object.entries(obj)
    .map(([k, v], i) => ({ key: k, value: Number(v), i })) // preserve original index
    .sort((a, b) => a.value - b.value || a.i - b.i) // sort by value, stable by index
    .map((e) => e.key)
    .join("");
};
client.on("message", (channel, tags, message, self) => {
  if (self) return; // Ignore messages from the bot itself
  if (!open) return; // Ignore messages if not open for answers

  const username = `${tags["display-name"]}`;
  if (responded.has(username)) return; // Ignore if user has already responded
  responded.add(username);

  const i = validate(message);
  if (i) {
    results[i] = results[i] ? results[i] + 1 : 1;
  }
  console.log(`Current results: ${JSON.stringify(results)}`);
});

client.connect();
