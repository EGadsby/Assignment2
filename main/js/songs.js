document.addEventListener('DOMContentLoaded', (e) => {
    const playlistId = sessionStorage.playlistSpotifyId;

    try {
        console.log("calling")
        displaySongsPage(playlistId);
    } catch (err) {
        throw err;
    }
})

function displaySongsPage(spotifyId) {
    console.log(spotifyId)
    fetch(`http://localhost:8888/spotify/playlists/${spotifyId}/tracks`, {
        method: 'GET'
    }).then((res) => {
        if (!res.ok) {
            throw new Error('HTTP Error! Status: ' + res.status);
        }
        return res.json();
    }).then((res) => {
        console.log(res)
        for (s of res) {
            console.log(s)
            let name = s.name;
            let artists = s.artists;
            let durationMs = s.durationMs;
            let imgUrls = s.images;


            generateSongsHTML(name, artists, durationMs, imgUrls);
        }
    })
}


function generateSongsHTML(name = "", artists = [], durationMs = 0, imgUrls) {
    const songsPanel = document.getElementById('songs-panel');

    const song = document.createElement('div');
    song.classList.add('song');

    const img = document.createElement('img');
    console.log(imgUrls)
    img.setAttribute('src', imgUrls[0].url);

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

    duration.textContent = `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`

    songInfo.appendChild(songTitle);
    songInfo.appendChild(artist);
    song.appendChild(img);
    song.appendChild(songInfo);
    song.appendChild(duration);
    songsPanel.appendChild(song);
}