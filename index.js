// Require the necessary discord.js classes
// const { Client, Intents, Message } = require('discord.js')
const { token } = require('./config.json')
const { guildId } = require('./config.json')
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
            if (msg.guild.id === result.EventGuild){
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
      msg.reply(msg.guild.id)
    }
  });

  client.on('messageCreate', async msg => {
    // to-do: Add this base case to all
    if (msg.author === client.user){
      return;
    }
    // const newDay = new Date(2018, 11, 24, 10, 33, 30, 0);
    // var dateArray;
    var dateString;
    if(msg.content.startsWith("!eventset")){
      const event = msg.content.replace('!eventset','');
      const eventID = randomstring.generate(20)
      if (event == ""){
        msg.reply("Please Enter a name for the event using '!eventset <Event Name>'")
        return;
      }
      msg.reply('Enter a Date in this order: "!yyyy/mm/dd"');
      client.on('messageCreate', async msg => {
        // to-do: test all edge cases: !234567890 shouldnt be an accepted string
        if(msg.content.startsWith("!") && msg.content.length == 11){
          dateString = msg.content.replace('!', '')
          // dateArray = dateString.split("/")
            const ServerID = client.guilds.cache.get();
            // ^ didnt get to test that yet
            await DB.collection('Events').doc(eventID).set({
              // to-do: change EventDetails to EventName, and maybe add another paramater that accepts a description
            EventDetails: event,
            User: msg.author.username,
            User_ID: msg.author.id,
            EventDate: dateString,
            EventGuild: ServerID
          }).then(() =>{
            msg.reply(`Event added successfully, Event ID: ${eventID}`)
          }).catch(() => {
            msg.reply("Error uploading to database. Please resubmit '!eventset <Event Name>'command")
          })
        } 
      });
    }
  })

  // to-do: Send notification through discord when EventDay is the current date

  // to-do: Create Git REPO and add gitignore on private files
  // to-do: Host bot
client.login(token)

