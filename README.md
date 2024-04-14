
# DrinknDash

## Description
DrinknDash is a React Native application based on a drinking card game where users bet against their friends to see which "Horse" will cross the finish line first. 
Create a lobby, send invitation to friends, place bets, talk in game and enjoy the game.

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
