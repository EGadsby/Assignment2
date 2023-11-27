document.addEventListener('DOMContentLoaded', (e) => {
    if (!getCookie('spotify_access_token'))
        location.href = "playlists.html";

    const playlistId = sessionStorage.playlistSpotifyId;

    try {
        displaySongsPage(playlistId);
    } catch (err) {
        throw err;
    }
})

function displaySongsPage(spotifyId) {
    // Hint: You will need to insert the spotifyId into the route.
    const route = ``;
    const method = '';

    fetch(route, {
        method: method
    }).then((res) => {
        if (!res.ok) {
            throw new Error('HTTP Error! Status: ' + res.status);
        }
        return res.json();
    }).then((res) => {
        // PARSE JSON AND GENERATE HTML HERE.



        // Hint: You may need to iterate while calling this function.
        // generateSongsHTML(name, artists, durationMs, images);
    })
}

/**
 * Generates HTML for songs.
 * @param {string} name - Name of the song.
 * @param {array} artists - Contributing Artistis on the song.
 * @param {int} durationMs - Duration of the song in milliseconds.
 * @param {array} images - Object containing the image information of the album the song belongs to.
 */
function generateSongsHTML(name = "", artists = [], durationMs = 0, images) {
    const songsPanel = document.getElementById('songs-panel');

    const song = document.createElement('div');
    song.classList.add('song');

    const img = document.createElement('img');
    img.setAttribute('src', images[0].url);

    const songInfo = document.createElement('div');
    songInfo.classList.add('song-info');

    const songTitle = document.createElement('h2');
    songTitle.classList.add('song-title');
    songTitle.textContent = name;

    const artist = document.createElement('span');
    artist.classList.add('artist');
    let str = artists[0].name;
    for (let i = 1; i < artists.length; i++) {
        if ((i + 1) >= artists.length) {
            str += " & " + artists[i].name;
        } else {
            str += ", " + artists[i].name;
        }
    }
    artist.textContent = str;

    const duration = document.createElement('div');
    duration.classList.add('song-duration');

    let totalSeconds = durationMs / 1000;
    let minutes = Math.floor(totalSeconds / 60);
    let remainingSeconds = Math.floor(totalSeconds % 60);

    duration.textContent = `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;

    songInfo.appendChild(songTitle);
    songInfo.appendChild(artist);
    song.appendChild(img);
    song.appendChild(songInfo);
    song.appendChild(duration);
    songsPanel.appendChild(song);
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
