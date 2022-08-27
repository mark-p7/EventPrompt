# EventPrompt Discord bot
![EventPromptLogo](https://user-images.githubusercontent.com/78812508/187024300-d02d0c01-5d8b-4e5e-98fe-f8021a1f5538.PNG)

Author: Mark De Guzman (mark-p7)

Discord Bot Name: EventPrompt

https://discord.com/api/oauth2/authorize?client_id=935408901397028905&permissions=274878106624&scope=bot 
## Description
Event Prompt is a Discord bot that allows users to send timed notifications to alert themselves of future events. Useful for birthdays, important meetings, doctor appointments or anything you want to be reminded of in the future.

## Instructions
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

## Documentation

!commands
: prints a list of commands 
  
!setevent <Event Name>
: creates an event with an AUTO-GENERATED ID

!seteventdate <Event ID> <yyyy/mm/dd>
: sets a date for an event

!seteventrecurrence <Event ID> <T/F>
: sets event to recurre every year if set True else delete event once passed

!eventgetall
: gets all events on the server

!eventgetbyid <Event ID>
: gets event by ID

## Technologies Used
- Javascript
    - Node.js
    - Discord.js
    - Firebase Cloud Firestore
