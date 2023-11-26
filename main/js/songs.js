
function generateSongsHTML(name = string, artists = [], durationMs = int, imgUrl = string) {
    const songsPanel = document.getElementById('songs-panel');

    const song = document.createElement('div');
    song.classList.add('song');

    const img = document.createElement('img');
    img.setAttribute('src', imgUrl);

    const songInfo = document.createElement('div');
    songInfo.classList.add('song-info');

    const songTitle = document.createElement('h2');
    songTitle.classList.add('song-title');
    songTitle.textContent = name;

    const artist = document.createElement('span');
    artist.classList.add('artist');
    let str = artists[0];
    for (let i = 1; i < artists.length; i++) {
        if ((i + 1) >= artists.length) {
            str += " & " + artists[i];
        } else {
            str += ", " + artists[i];
        }
    }
    artist.textContent = str;

    const duration = document.createElement('div');
    duration.classList.add('song-duration');

    let totalSeconds = durationMs / 1000;
    let minutes = Math.floor(totalSeconds / 60);
    let remainingSeconds = Math.floor(totalSeconds % 60);

    duration.textContent = `${minutes}:${remainingSeconds}`;

    songInfo.appendChild(songTitle);
    songInfo.appendChild(artist);
    song.appendChild(img);
    song.appendChild(songInfo);
    song.appendChild(duration);
    songsPanel.appendChild(song);
}

let imgUrl = "https://images.immediate.co.uk/production/volatile/sites/3/2018/08/Simpsons_SO28_Gallery_11-fb0b632.jpg?quality=90&resize=800,534";
generateSongsHTML("Sussy Homer", ["Sir Mixalot, Lebron James, Pookie Bear"], 90000, imgUrl);