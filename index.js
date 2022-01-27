// Require the necessary discord.js classes
// const { Client, Intents, Message } = require('discord.js')
const {
  token
} = require('./config.json')
const {
  guildId
} = require('./config.json')
const Discord = require('discord.js')
const randomstring = require("randomstring");
// const config = require('./config.json')
// Create a new client instance
const client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES"
  ]
})
// const client = new Discord.Client();
// const mySecret = process.env['DISCORD_TOKEN'];
var admin = require("firebase-admin");
var serviceAccount = require("./firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const DB = admin.firestore();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('messageCreate', msg => {
  if (msg.content === '!IMISSTHERAGE') {
    msg.reply('I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!?');
    msg.reply('eeeI MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!? I MISS THE RAGE!?');

  }
});

// !commands
client.on('messageCreate', msg => {
  if (msg.content === '!commands') {
    msg.reply("!eventset <Event Name>\n: creates an event with an AUTO-GENERATED ID\n"
    + "\n!eventdate <Event ID>, <yyyy/mm/dd>\n: sets a date for an event\n"
    + "\n!eventgetall\n: gets all events on the server\n"
    + "\n!eventgetbyid\n: gets event by ID\n");
  }
});

// !eventgetall
client.on('messageCreate', msg => {
  if (msg.content === '!eventgetall') {
    var count = 0
    DB.collection("Events").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        result = doc.data()
        let eventName = result.EventName
        let eventDate = result.EventDate
        if (msg.guild.id === result.EventGuild) {
          if (eventDate == null){
            msg.reply(`Event Name: ${eventName}\nEvent ID: ${doc.id}`);
          } else{
            msg.reply(`Event Name: ${eventName}\nEvent Date: ${eventDate}\nEvent ID: ${doc.id}`);
          }
          count++
        }
        // to-do: format eventdate to display in string format ex: Tuesday 27 2022
      });
      
    }).finally(() =>{
      msg.reply(`Found ${count} Events.`)
    });
  }
});

// !getserverid
client.on('messageCreate', msg => {
  if (msg.content === '!getserverid') {
    // to-do: get specific event by id
    msg.reply(client.guilds.cache.get(msg.guild.id).id)
  }
});

// !eventset
client.on('messageCreate', msg => {

  if (msg.author === client.user) {
    return;
  }

  if (msg.content.startsWith("!eventset ")) {
    var event = msg.content.replace('!eventset ', '');
    event = event.replace(" ", "");
    if (event == "") {
      msg.reply("Please Enter a name for the event using '!eventset <Event Name>'")
      return;
    }
    const eventID = randomstring.generate(20)
    const author = msg.author.id;
    const guild = msg.guild.id;
    DB.collection("Events").doc(eventID).set({
      EventName: event,
      EventOwner: author,
      EventGuild: guild,
      DocID: eventID
    })

    msg.reply(`Event ID: ${eventID} Created, there are some commands to try out to help you manage your event:\n!eventdate <Event ID>, <yyyy/mm/dd>\n!eventgetbyid <Event ID>\n!eventdelete <Event ID>\n!eventgetall`);
  }

})

// Returns true if DocID is in collection
async function checkEventId(eventId){
  const EventCollection = DB.collection('Events');
  const snapshot = await EventCollection.where('DocID', '==', eventId).get();
  if (snapshot.empty) {
    return false;
  }  
  return true;
}


// !eventdate 
client.on('messageCreate', async msg => {
  if (msg.author === client.user) {
    return;
  }
  // to-do: test all edge cases: !234567890 shouldnt be an accepted string
  if (msg.content.startsWith("!eventdate ") && msg.content.length == 43) {
    var IDandDate = msg.content.replace('!eventdate', '')
    var dateArray = IDandDate.split(",")
    let eventID = dateArray[0].replace(' ', '')
    let date = dateArray[1].replace(' ', '')
    console.log(eventID)
    console.log(date)

    if (checkEventId(eventID)){

      const collection = DB.collection('Events').doc(eventID);
      const doc = await collection.get();
      const res = doc.data();

      DB.collection('Events').doc(eventID).update({
        EventDate: date
      }).then(() => {
        msg.reply(`Event: ${res.EventName}, now scheduled for ${date}`)
      })
    } else{
      msg.reply("Event does not exist. Please try again. " + eventID)
    }
  } else if (msg.content.startsWith("!eventsdate")){
    msg.reply("Please make sure your arguments are correct. It should have the format of '!eventdate <Event ID>, <yyyy/mm/dd>'")
  }
});


// to-do: Send notification through discord when EventDay is the current date
// to-do: Host bot  

client.login(token)