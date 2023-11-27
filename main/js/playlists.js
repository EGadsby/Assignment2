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

function displayPlaylistsPage() {
    fetch('http://localhost:8888/spotify/playlists', {
        method: 'GET'
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json(); // Parse the response as JSON
    }).then(data => {
        // Now 'data' is the parsed JSON object
        if (data.items) {
            console.log(data.items.length)
            for (let p of data.items) { // Use 'of' instead of 'in' for iterating over arrays
                let name = p.name;
                let spotifyID = p.id;
                let imageUrl = p.images[0].url; // Assuming 'images' is an array and has a 'url' property
                let trackCount = p.tracks.total;

                generatePlaylistHTML(name, spotifyID, imageUrl, trackCount);
            }
        } else {
            console.log('No items found in response');
        }
    }).catch(err => {
        console.error('Fetch error:', err);
    });
}


function generatePlaylistHTML(name = "", spotifyId = "", imageUrl = "", trackCount = 0) {
    const playlistsPanel = document.getElementById('playlists-panel');

    const playlist = document.createElement('div');
    playlist.classList.add('playlist');
    playlist.dataset.spotifyId = spotifyId;

    playlist.addEventListener('click', (e) => {
        console.log("This shit was pressed");
        sessionStorage.playlistSpotifyId = spotifyId;
        location.href = "songs.html"; // Songs page.
    });

    const playlistInfo = document.createElement('div');
    playlistInfo.classList.add('playlist-info');

    const img = document.createElement('img');
    img.setAttribute('src', imageUrl);

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
