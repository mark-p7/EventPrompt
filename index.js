// const { Client, Intents, Message } = require('discord.js')
const schedule = require('node-schedule');
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

// !commands
client.on('messageCreate', msg => {
  if (msg.content === '!commands') {
    msg.reply("!setevent <Event Name>\n: creates an event with an auto-generated ID\n"
      + "\n!seteventdate <Event ID> <yyyy/mm/dd>\n: sets a date for an event\n"
      + "\n!seteventrecurrence\n: gets all events on the server\n"
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
          if (eventDate == null) {
            msg.reply(`Event Name: ${eventName}\nEvent ID: ${doc.id}`);
          } else {
            msg.reply(`Event Name: ${eventName}\nEvent Date: ${eventDate}\nEvent ID: ${doc.id}`);
          }
          count++
        }
        // to-do: format eventdate to display in string format ex: Tuesday 27 2022
      });

    }).finally(() => {
      msg.reply(`Found ${count} Event(s)`)
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

// !setevent
client.on('messageCreate', msg => {

  if (msg.author === client.user) {
    return;
  }

  if (msg.content.startsWith("!setevent ")) {
    var event = msg.content.replace('!setevent ', '');
    event = event.replace(" ", "");
    if (event == "") {
      msg.reply("Please Enter a name for the event using '!setevent <Event Name>'")
      return;
    }
    const eventID = randomstring.generate(20)
    const author = msg.author.id;
    const guild = msg.guild.id;
    const channel = msg.channel.id;
    DB.collection("Events").doc(eventID).set({
      EventName: event,
      EventOwner: author,
      EventGuild: guild,
      EventDate: "0000/00/00",
      EventChannel: channel,
      DocID: eventID,
      Recurring: false
    })

    msg.reply(`Event ID: ${eventID} Created, there are some commands to try out to help you manage your event:\n!seteventdate <Event ID> <yyyy/mm/dd>\n!seteventrecurrence <Event ID> <T/F>\n!eventgetbyid <Event ID>\n!eventdelete <Event ID>\n!eventgetall`);
  }

})

// Returns true if DocID is in collection
async function checkEventId(eventId) {
  const EventCollection = DB.collection('Events');
  const snapshot = await EventCollection.where('DocID', '==', eventId).get();
  if (snapshot.empty) {
    return false;
  }
  return true;
}

// !seteventrecurring 
client.on('messageCreate', async msg => {
  if (msg.author === client.user) {
    return;
  }
  // to-do: test all edge cases: !234567890 shouldnt be an accepted string
  if (msg.content.startsWith("!seteventrecurrence ") && msg.content.length == 42) {
    var TrueOrFalseMsg = msg.content.replace('!seteventrecurrence ', '')
    const TrueOfFalseArr = TrueOrFalseMsg.split(" ")
    let eventID = TrueOfFalseArr[0]
    let TrueOrFalse = TrueOfFalseArr[1]

    if(TrueOrFalse.toString() !== "T" && TrueOrFalse.toString() !== "F") {
      msg.reply("Please make sure you follow the proper format, '!seteventrecurrence <Event ID> T' to set recurrence to TRUE or '!seteventrecurrence <Event ID> F' to set recurrence to FALSE")
      return;
    }
    var recurrence;
    if (TrueOrFalse == "T" || TrueOrFalse == "t") {
      recurrence = true
    } else if (TrueOrFalse == "F" || TrueOrFalse == "f") {
      recurrence = false
    }
    if (checkEventId(eventID)) {
      const collection = DB.collection('Events').doc(eventID);
      const doc = await collection.get();
      const res = doc.data();
      DB.collection('Events').doc(eventID).update({
        Recurring: recurrence
      }).then(() => {
        msg.reply(`Event: ${res.EventName}, Recurrence is now set to ${recurrence}`)
      })
    } else {
      msg.reply("Event does not exist. Please try again. " + eventID)
    }
  } else if (msg.content.startsWith("!seteventrecurrence ")) {
    msg.reply("Please make sure you follow the proper format, '!seteventrecurrence <Event ID> T' to set recurrence to TRUE or '!seteventrecurrence <Event ID> F' to set recurrence to FALSE")
  }
});


// !seteventdate 
client.on('messageCreate', async msg => {
  if (msg.author === client.user) {
    return;
  }
  // to-do: test all edge cases: !234567890 shouldnt be an accepted string
  if (msg.content.startsWith("!seteventdate ") && msg.content.length == 45) {
    var IDandDate = msg.content.replace('!seteventdate ', '')
    var dateArray = IDandDate.split(" ")
    let eventID = dateArray[0]
    let date = dateArray[1]
    console.log(eventID)
    console.log(date)

    if (checkEventId(eventID)) {

      const collection = DB.collection('Events').doc(eventID);
      const doc = await collection.get();
      const res = doc.data();

      DB.collection('Events').doc(eventID).update({
        EventDate: date
      }).then(() => {
        msg.reply(`Event: ${res.EventName}, now scheduled for ${date}`)
      })
    } else {
      msg.reply("Event does not exist. Please try again. " + eventID)
    }
  } else if (msg.content.startsWith("!seteventdate")) {
    msg.reply("Please make sure your arguments are correct. It should have the format of '!seteventdate <Event ID> <yyyy/mm/dd>'")
  }
});


// to-do: Send notification through discord when EventDay is the current date
// Checks if any events happen to be today
schedule.scheduleJob('0 0 * * *', () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '/' + mm + '/' + dd;
  console.log(today)
  DB.collection("Events").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      result = doc.data()
      let eventName = result.EventName
      let eventOwner = result.EventOwner
      let eventDate = result.EventDate
      let eventRecurrence = result.Recurring
      console.log(eventDate);
      const channel = client.channels.cache.get(result.EventChannel);
      if (eventDate == today) {
        console.log(`<@${eventOwner}> There is currently an event today: ${eventName}`);
        channel.send(`<@${eventOwner}> There is currently an event today: ${eventName}`);
        if (!eventRecurrence) {
          console.log(`<@${eventOwner}> Deleting: ${eventName}`);
          channel.send(`<@${eventOwner}> Deleting: ${eventName}`);
          DB.collection('Events').doc(result.DocID).delete();
        } else {
          let oldDate = eventDate.split("");
          var num = parseInt(oldDate[3])
          oldDate[3] = (num + 1).toString();
          let newDate = oldDate.join("");
          DB.collection('Events').doc(result.DocID).update({
            EventDate: newDate
          });
          console.log(`<@${eventOwner}> Year Changed to ${newDate}: ${eventName}`);
          channel.send(`<@${eventOwner}> Year Changed to ${newDate}: ${eventName}`);
        }
      }
      // to-do: format eventdate to display in string format ex: Tuesday 27 2022
    });
  });
})
// to-do: Host bot  

client.login(token)