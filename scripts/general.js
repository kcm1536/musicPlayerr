const homeButton = document.querySelector('.home-page-button')
const lyricsButton = document.querySelector('.lyric-page-button')
const queueButton = document.querySelector('.queue-page-button')

let albums;
let songs;

async function fetchAlbums() {
    try {
        const response = await fetch('../jsonFiles/album.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching and parsing JSON:', error);
    }
}

async function loadAlbums() {
    albums = await fetchAlbums();

    if (albums) {
        const albumSelectionMenu = document.querySelector(".album-selection-view");

        albums.forEach(element => {
            const newAlbum = document.createElement('img');
            newAlbum.src = `../albumCovers/${element.fileName}.png`;
            newAlbum.addEventListener('click', () => {
              loadAlbumView(element)
            })
            albumSelectionMenu.appendChild(newAlbum);
        });
    }
}

async function fetchSongs(){
    try {
        const response = await fetch('../jsonFiles/song.json')
        const data = await response.json()
        return data;
    } catch (error) {
        console.error('Error fetching and parsing JSON:', error);
    }
}

async function loadSongs(){
    songs = await fetchSongs()
}

function changePage(page) {
    const views = document.querySelectorAll('.page-view')
    const targetViewClass = `${page}-view`
    if(targetViewClass === 'queue-view'){
        renderAllSongs()
        renderQueue()
    }
    if(targetViewClass === 'album-selection-view'){
        if(targetAlbum){
            loadAlbumView(targetAlbum)
            return
        }
    }
    views.forEach((page) => {
        if(page.classList[0] === targetViewClass){
            const targetView = document.querySelector(`.${targetViewClass}`)
            targetView.style.display = 'flex'
        } else {
            const otherView = document.querySelector(`.${page.classList[0]}`)
            otherView.style.display = 'none'
        }
    })
}

loadAlbums();
loadSongs();

// Event Listeners
homeButton.addEventListener('click', () => {
    changePage('album-selection')
})
lyricsButton.addEventListener('click', () => {
    changePage('lyrics')
})
queueButton.addEventListener('click', () => {
    changePage('queue')
})

// Keyboard Shortcuts
document.addEventListener('keyup', (e) => {
    if(e.code === "ArrowLeft" || e.code === "Numpad4"){
        skipSong(-1)
    } else if(e.code === "Space" || e.code === "Numpad5") {
        pauseSong()
    } else if (e.code === "ArrowRight" || e.code === "Numpad6"){
        skipSong(1)
    } else if (e.code === "KeyN" || e.code === "Numpad2") {
        loop()
    } else if (e.code === "KeyM" || e.code === "Numpad3") {
        shuffle()
    } else if (e.code === "KeyZ" || e.code === "Numpad7") {
        changePage('album-selection')
    } else if (e.code === "KeyX" || e.code === "Numpad8") {
        changePage('lyrics')
    } else if (e.code === "KeyC" || e.code === "Numpad9") {
        changePage('queue')
    } else if (e.code === "KeyR" || e.code === "Numpad1") {
        resetPlayer()
    } else if (e.code === "KeyQ") {
        console.log(currentSongNumber)
    }
  })

