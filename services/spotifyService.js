const fs = require('fs').promises;
const axios = require('axios');

class SpotifyService {
    static async getTracks(page, offset, playlistid) {
        try {

            const data = await fs.readFile('bearer.json', 'utf8');
            let jsonData = JSON.parse(data);

            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `https://api.spotify.com/v1/playlists/${playlistid}/tracks?offset=${offset}&limit=100`,
                headers: {
                    'Authorization': `Bearer ${jsonData.access_token}`
                }
            };


            const response = await axios.request(config);
            const items = response.data.items;

            return items.map(item => item.track.external_ids.isrc);

        } catch (error) {
            console.error('Error:', error);
            throw error; // Rethrow the error to handle it where the function is called
        }
    }
}



module.exports = SpotifyService