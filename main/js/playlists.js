document.addEventListener('DOMContentLoaded', async (e) => {
    console.log("ayy lmao")
    try {
        //await fetch('localhost:8888/spotify/login')
        displayPlaylistsPage();
    } catch (err) {
        throw err;
    }
})


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
            for (let p of data.items) { // Use 'of' instead of 'in' for iterating over arrays
                let name = p.name;
                let spotifyID = p.id;
                let imageUrl = p.images[1].url; // Assuming 'images' is an array and has a 'url' property
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

function displayPage() {
    // REST API calls go here.



    // Use that information to generate the playlist HTML.

    // generatePlaylistHTML();
}




function generatePlaylistHTML(name = string, spotifyId = string, imageUrl = string, trackCount = int) {
    const playlistsPanel = document.getElementById('playlists-panel');

    const playlist = document.createElement('div');
    playlist.classList.add('playlist');
    playlist.dataset.spotifyId = spotifyId;

    playlist.addEventListener('click', (e) => {
        console.log("This shit was pressed");
        sessionStorage.playlistSpotifyId = spotifyId;
        location.href = "../HTML/songs.html"; // Songs page.
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