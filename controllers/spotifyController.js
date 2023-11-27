// Making this class to help keep the code clean by seperating the spotify code from the other code
require('dotenv').config();
let querystring = require('querystring')
const axios = require('axios')
const fs = require('fs')


import { generateRandomString } from '../helpers/stringHelpers';

let client_id = process.env.client_id;
let client_secret = process.env.client_secret;
var redirect_uri = 'http://localhost:8888/spotify/callback';


const express = require('express');
const app = express.Router(); // calling routes on api

// PASTE THE LOGIN FUNCTION HERE


// Callback function we've provided to Spotify
app.get('/callback', function (req, res) {
    // The below code we get directly from the spotify api documentation
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) { // error handling, with redirect to state mismatch
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        // The code below here we created ourselves
        axios.post(authOptions.url, querystring.stringify(authOptions.form), { // Sending the request via post to spotify url to receive the bearer token
            headers: authOptions.headers
        }).then(response => { // We use the .then function to wait for a response from the above post to the spotify api
            const dataString = JSON.stringify(response.data, null, 2) // Converting the response (including the bearer token) to JSON
            console.log(response.data);
            fs.writeFile('bearer.json', dataString, () => { }) // Saving the reponse to a file
            res.send(response.data) //ends the flow of the endpoint and prints stuff to the screen
        })
        // error handling below
        .catch(error => {
            console.error(error);
            res.status(500).send('Internal Server Error'); // Send error response to client
        });
    }
});


// playlist getting function by parsing the bearer token from the bearer.json file 
// test using ?page=1 param
app.get('/playlists', function (req, res) {
    var page = req.query.page || 1;

    let offset = (page - 1) * 50// in case the user has more than 50 playlist (how cultured)

    fs.readFile('bearer.json', 'utf8', (err, data) => { // Reads the information from the bearer file
        if (err) { // Error handling if we cannot read from file for whatever reason
            console.error('Error reading file:', err);
            return;
        }
        try { // here we are parsing the data from the bearer.json file
            let jsonData = JSON.parse(data);
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=50`,// the url for the spotify playlist api
                headers: {
                    'Authorization': `Bearer ${jsonData.access_token}` // passing in the access token as a header
                }
            };

            console.log(config)
            axios.request(config) // similar to the callback endpoint, we are using axios to post the request async 
                .then((response) => {
                    console.log(JSON.stringify(response.data.items));
                    res.send(response.data) // displaying the JSON response on screen
                })
                .catch((error) => {
                    console.log(error); // error handling 
                });
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    })
});


app.get(`/playlists/:playlist_id/tracks`, async function (req, res) {
    var page = req.query.page || 1;

    let offset = (page - 1) * 100

    var playlistid = req.params.playlist_id

    // Try coding the answer here!
    


});

// DO NOT GO BEYOND THIS POINT

app.get('/auth', function (req, res) {
    fs.readFile('bearer.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        try {
            let jsonData = JSON.parse(data);
            res.send(jsonData);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    })
});

app.get('/me', function (req, res) {
    fs.readFile('bearer.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        try {
            let jsonData = JSON.parse(data);
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.spotify.com/v1/me`,// the url for the spotify playlist api
                headers: {
                    'Authorization': `Bearer ${jsonData.access_token}` // passing in the access token as a header
                }
            };

            axios.request(config) // similar to the callback endpoint, we are using axios to post the request async 
                .then((response) => {
                    res.send(response)
                })
                .catch((error) => {
                    console.log(error); // error handling 
                });
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    })
});

module.exports = app; 
