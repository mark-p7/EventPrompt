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

client.on('messageCreate', msg => {
  // to-do: Update Commands
  if (msg.content === '!commands') {
    msg.reply("commands: !eventset <Event Name>\n!eventgetbyid\n!eventgetall");
  }
});

// client.on('messageCreate', msg => {
//   if (msg.content === '!eventget') {
//     let allEvents = DB.collection("Events");
//     let events = allEvents.get().then(snapshot => {
//       snapshot.forEach(doc => {
//         msg.reply(doc.id, '=>', doc.data());
//       });
//     })
//   }
// });

client.on('messageCreate', msg => {
  if (msg.content === '!eventgetall') {
    DB.collection("Events").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        result = doc.data()
        let eventName = result.EventDetails
        let eventDate = result.EventDate
        if (msg.guild.id === result.EventGuild) {
          msg.reply(`Event Name: ${eventName}\nEvent Date: ${eventDate}\nEvent ID: ${doc.id}`);
        }
        // to-do: format eventdate to display in string format ex: Tuesday 27 2022
      });
    })
  }
});

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

  if (msg.content.startsWith("!eventset")) {
    const event = msg.content.replace('!eventset', '');
    if (event == "") {
      msg.reply("Please Enter a name for the event using '!eventset <Event Name>'")
      return;
    }
    const eventID = randomstring.generate(20)
    const author = msg.author.id;
    const guild = msg.guild.id;
    DB.collection("Events").doc(eventID).set({
      EventOwner: author,
      EventGuild: guild,
      DocID = eventID
    })

    msg.reply('Event Created, there are some commands to try out to help you manage your event:\n!eventdate <Event ID>, <yyyy/mm/dd>\n!eventgetbyid <Event ID>\n!eventdelete <Event ID>\n!eventgetall');
  }

})

// !eventdate 
client.on('messageCreate', msg => {
  if (msg.author === client.user) {
    return;
  }
  // to-do: test all edge cases: !234567890 shouldnt be an accepted string
  if (msg.content.startsWith("!eventdate") && msg.content.length == 43) {
    var IDandDate = msg.content.replace('!eventdate', '')
    var dateArray = IDandDate.split(",")
    let eventID = dateArray[0]
    let date = dateArray[1]

    DB.collection("Events").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        result = doc.data()
        let index = 0
        if (eventID === result.DocID) {
          result.DocID
          msg.reply(`Event Name: ${eventName}\nEvent Date: ${eventDate}\nEvent ID: ${doc.id}`);
          index++;
        }
        if (index == 0){
          msg.reply("Could not find Event ID string. Please make sure the Event ID is correct.")
        }
        // to-do: format eventdate to display in string format ex: Tuesday 27 2022
      });
    })
    
    DB.collection('Events').doc(eventID).update({
      // to-do: change EventDetails to EventName, and maybe add another paramater that accepts a description
      EventDate: date
    }).then(() => {
      msg.reply(`Date added successfully for Event ID: ${eventID}`)
    }).catch(() => {
      msg.reply("Error uploading to database. Please resubmit '!eventset <Event Name>'command")
    }).finally(() => {
      return;
    })
  } else if (msg.content.startsWith("!eventsdate")){
    msg.reply("Please make sure your arguments are correct. It should have the format of '!eventdate <Event ID>, <yyyy/mm/dd>'")
  }
});


// to-do: Send notification through discord when EventDay is the current date

// to-do: Create Git REPO and add gitignore on private files
// to-do: Host bot


client.login(token)