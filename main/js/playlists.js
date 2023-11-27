document.addEventListener('DOMContentLoaded', async (e) => {
    fetch('http://localhost:8888/spotify/auth', {
        method: 'GET'
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json(); // Parse the response as JSON
    }).then(data => {
        createCookie('spotify_access_token', data.access_token, 30);
        console.log("Cookie created!");
    }).catch(err => {
        console.error('Fetch error:', err);
    });

    fetch('http://localhost:8888/spotify/me', {
        method: 'GET'
    }).then(res => {
        if (!res.ok)
            location.href = "http://localhost:8888/spotify/login"; // Login page.
    }).catch(err => {
        console.error('Fetch error:', err);
    });

    try {
        displayPlaylistsPage();
    } catch (err) {
        throw err;
    }
})

function displayPlaylistsPage() {
    // Fill these in.
    const route = 'http://localhost:8888/spotify/playlists';
    const method = 'GET';

    fetch(route, {
        method: method
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json(); // Parse the response as JSON
    }).then(data => {
        // FILL IN CODE HERE TO PARSE JSON AND GENERATE HTML
        const items = data.items;
        for (item of items) {
            let name = item.name;
            let id = item.id;
            let images = item.images;
            let trackCount = item.tracks.total;

            generatePlaylistHTML(name, id, images, trackCount);
        }

        // Hint: You may need to iterate while calling this function.D
        // generatePlaylistHTML(name, spotifyId, images, trackCount);
    }).catch(err => {
        console.error('Fetch error:', err);
    });
}

/**
 * Generates HTML of playlists.
 * @param {string} name - The name of the playlist.
 * @param {string} spotifyId - the id of the playlist in Spotify.
 * @param {*} images - The image information of the playlist.
 * @param {int} trackCount - the amount of tracks/songs on the playlist.
 */
function generatePlaylistHTML(name, spotifyId, images, trackCount) {
    const playlistsPanel = document.getElementById('playlists-panel');

    const playlist = document.createElement('div');
    playlist.classList.add('playlist');
    playlist.dataset.spotifyId = spotifyId;

    playlist.addEventListener('click', (e) => {
        sessionStorage.playlistSpotifyId = spotifyId;
        location.href = "songs.html"; // Songs page.
    });

    const playlistInfo = document.createElement('div');
    playlistInfo.classList.add('playlist-info');

    const img = document.createElement('img');
    img.setAttribute('src', images[0].url);

    const nameHeader = document.createElement('h2');
    nameHeader.classList.add('playlist-name');
    nameHeader.textContent = name;

    const trackSpan = document.createElement('span');
    trackSpan.classList.add('track-count');
    trackSpan.textContent = `${trackCount} songs`;

    playlistInfo.appendChild(nameHeader);
    playlistInfo.appendChild(trackSpan);
    playlist.appendChild(img);
    playlist.appendChild(playlistInfo);
    playlistsPanel.appendChild(playlist);
}

function createCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = `; expires=${date.toGMTString()}`;
    }
    const cookieToCreate = `${name}=${value}${expires}; path=/;`;
    document.cookie = cookieToCreate;
    // console.log("Cookie being created: ", cookieToCreate); // Uncomment for debugging
}