import tmi from "tmi.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import firebaseConfig from "./data/firebaseConfig.json" assert { type: "json" };
import config from "./config.json" assert { type: "json" };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const client = new tmi.Client({
  channels: [config.settings.twitchChannel],
});

let currentlyPolling = false;
let results = { 1: 0, 2: 0, 3: 0, 4: 0 };
let respondedUsers = new Set();

let statusRef = ref(database, "status/loading");

let resultsRef = ref(database, "status/results");

onValue(statusRef, (snapshot) => {
  const data = snapshot.val();
  currentlyPolling = data;
  if (currentlyPolling) {
    results = { 1: 0, 2: 0, 3: 0, 4: 0 };
    respondedUsers.clear();
    let interval = setTimeout(() => {
      set(statusRef, false);
      set(resultsRef, results);
    }, 60000); // 60 seconds to answer
  }
  console.info("Currently Polling:", currentlyPolling);
});

const validate = (message) => {
  const regex = /^[1-4]/;

  if (regex.test(message) && message.length === 1) {
    return message;
  }
  return null;
};

client.on("message", (channel, tags, message, self) => {
  if (self || !currentlyPolling) return; // Ignore messages from the bot or if not currently polling

  const username = `${tags["display-name"]}`;
  if (respondedUsers.has(username)) return; // Ignore if user has already responded

  respondedUsers.add(username);

  const i = validate(message);

  if (i) {
    results[i] = results[i] ? results[i] + 1 : 1;
  } else {
    return;
  }

  console.table(results);
});

client.connect();
