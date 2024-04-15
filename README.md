
# DrinknDash

## Description
DrinknDash is a React Native application based on a drinking card game where users bet against their friends to see which "Horse" will cross the finish line first. 
Create a lobby, send invitation to friends, place bets, send messages and enjoy the game.

## Rules
Prior to the start of the game, the players  inside a game lobby can select to place a bet on one of four racehorses, represented by the 4 suits in a standard playing deck of cards. Players can select their desired bet amount, ranging from 1 to 6 and upon winning they receive double their bet amount to hand out to another player in the lobby. The game plays itself out without any influence from the players; their sole responsibility is to enjoy the race and wait for the results. 
The core mechanic of the game is the drawing of cards from a randomized deck of playing cards. Each horse is assigned a card suit and if that suit is drawn, they move closer towards the end. Throughout the game, after every horse has passed a segment of the racetrack, a ‘punishment’ card will be drawn moving the corresponding horse back a position. The game ends whenever the first horse crosses the finish line. Players return to the lobby, where winners can distribute their winnings to others. The players are then to play again. 

## Installation Guide
Perquisite 
Download  
- **Expo Client _(Expo Go)_** App which can be found on the Apple and Google play store.  

- **Node.js** Perform an npm install to retrieve the packages.
     - Make sure to download the Expo Cli
		- _npm install -g expo-cli_ 
		
- **PostgreSQL database**
   Create a copy of the PostgreSQL database with the Dump File provided. 
_Run the `psql` command with the `-f` option to execute the SQL commands in the dump file and recreate the database schema and data._
Database: postgres
User name: postgres
Password: 123qweR


 ## Running the app
 
1. Start the Webserver can be started inside the server directory using the command: 
> node index.js. 

>**Note:** Replace the Ip address in the **websocketContext.js** to a another one if needed.
>  ```
>const  ws  =  new  WebSocket('ws://192.168.2.2:8080');

2. Start the Expo development server from the root of the project
> npx expo start

3. Launch the Expo Go app and scan the provided QR code or type in the URL manually. 
