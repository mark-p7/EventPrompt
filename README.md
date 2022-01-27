# Proc7
Github User: GeneticDiff
Author: Mark De Guzman

Discord Bot Name: PROC7

Description:
Gives a set of certain commands to users that allows them to create events on certain dates and allows users to set notifications when
the date of the event comes.

Instructions
To run your bot with this code, please do the following:
First install node.js ver 16.6.0 or higher
Install Discord.js: `npm install discord.js`
Install Firebase: `npm install --save firebase-admin`
Go to Firebase console > Create a project > Go to service account under project settings > copy paste node.js code then generate private key and save it as firebase.json
Create a config.json file with the code below pasted in:
`
{
    "token": "<your-token-goes-here>"
}
`
You can get your token from creating a discord bot here > https://discord.com/developers/applications
Just click 'bot' under the settings tab and copy the token from there

Use case example: 

!eventset <Event-Name>

--Bot will create an event and auto generate an Event ID--

!eventdate <Event-ID>, <YYYY/MM/DD>

--Bot will verify and add the date to the event the database--

Documentation:

!commands
: prints a list of commands 
  
!eventset <Event Name>
: creates an event with an AUTO-GENERATED ID

!eventdate <Event ID>, <yyyy/mm/dd>
: sets a date for an event

!eventgetall
: gets all events on the server

!eventgetbyid
: gets event by ID


