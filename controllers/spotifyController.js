// Making this class to help keep the code clean by seperating the spotify code from the other code
require('dotenv').config();
let querystring = require('querystring')
const axios = require('axios')
const fs = require('fs')

const StringHelper = require('../helpers/stringHelpers')
const SpotifyService = require('../services/spotifyService')

let client_id = process.env.client_id;
let client_secret = process.env.client_secret;
var redirect_uri = 'http://localhost:8888/spotify/callback';


const express = require('express');
const router = express.Router(); // calling routes on api

router.get('/login', function (req, res) {
    var state = StringHelper.generateRandomString(16);
    var scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

router.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
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

        axios.post(authOptions.url, querystring.stringify(authOptions.form), {
            headers: authOptions.headers
        })
            .then(response => {
                const dataString = JSON.stringify(response.data, null, 2)

                console.log(response.data);
                fs.writeFile('bearer.json', dataString, () => { })
                res.send(response.data) //ends the flow of the endpoint and prints stuff to the screen
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error'); // Send error response to client
            });
    }
});

// playlist getting function by parsing the bearer token from the bearer.json file 
// test using ?page=1 param
router.get('/playlists', function (req, res) {
    var page = req.query.page || 1;

    let offset = (page - 1) * 50// in case the user has more than 50 playlist (how cultured)

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
                url: `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=50`,
                headers: {
                    'Authorization': `Bearer ${jsonData.access_token}`
                }
            };

            console.log(config)
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    res.send(response.data)
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    })


});

/**
 * provide a playlist id and receive all of the isrcs within the playlist
 * 
 * @param {playlist_id} = path variable, unique id of the playlist retrieved from the previous function
 * @param {page} = query param, if user has more than 100 songs in a playlist this will allow us to retrieve the whole playlist
 * 
 * @returns array of isrcs :D
 */
router.get(`/playlists/:playlist_id/tracks`, async function (req, res) {
    var page = req.query.page || 1;

    let offset = (page - 1) * 100

    var playlistid = req.params.playlist_id

    let result = await SpotifyService.getTracks(page, offset, playlistid)

    res.send(result)


});






module.exports = router; 