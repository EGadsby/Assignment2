
fetch('localhost:8888/spotify/login')
// .then((response) => {

// })
// .catch((err) => {
//     throw err;
// })

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