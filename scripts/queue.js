const library = document.querySelector('.library') 
const queueDisplay = document.querySelector('.queue')
const songLibraryButton = document.querySelector('.all-songs-header')
const albumLibraryButton = document.querySelector('.all-albums-header')
const clearQueueButton = document.querySelector('.clear-queue-button')

function playSingleSong(id){
  clearMusic()
  const songname = id
  let album
  for(let i = 0; i < songs.length; i++) {
    if(songs[i].fileName === id){
      album = songs[i].album
      break
    }
  }
  song = new Audio(`../music/${album}/${id}.m4a`)
  song.id = songname
  queue.push(song)
  renderQueue()
  playQueue()
}

function addToQueue(id){
  const songname = id
  let album
  for(let i = 0; i < songs.length; i++) {
    if(songs[i].fileName === id){
      album = songs[i].album
      break
    }
  }
  song = new Audio(`../music/${album}/${id}.m4a`)
  song.id = songname
  queue.push(song)
  renderQueue()
}

function addAlbumToQueue(id) {
  for(let i = 0; i < albums.length; i++){
    if(id === albums[i].fileName){
      for(let a = 1; a < albums[i].albumLength + 1; a++){
        song = new Audio(`../music/${albums[i].fileName}/${albums[i].fileName}${a}.m4a`)
        song.id = `${albums[i].fileName}${a}`
        queue.push(song)
        renderQueue()
      }
    }
  }
}

function removeFromQueue(id){
  let playing = !queue[currentSongNumber].paused;

  for(let i = 0; i < queue.length; i++){
    if(queue[i].id === id){
      if(i === currentSongNumber){
        queue[currentSongNumber].pause()
        queue.splice(i, 1)
        renderQueue()
        playing && playQueue();;
        updateInfoContainer()
        break
      }
      queue.splice(i, 1)
      renderQueue()
      break
    }
  }
}

function renderAllSongs() {
  library.innerHTML = ""
  songs.forEach(song => {
    songItem = document.createElement('div')
    songItem.classList.add('song-item')
    songItem.innerHTML = `
    <div class="song-item">
      <div class="song-item-artwork" id="${song.fileName}">
         <img src="albumCovers/${song.album}.png">
      </div>
      <div class="song-item-title">
        ${song.title}
      </div>
      <div class="song-item-add" id=${song.fileName}>
        +
      </div>
    </div>
    `
    library.appendChild(songItem)
  });

  const buttons = document.querySelectorAll('.song-item-add')
  buttons.forEach((button) => {
    button.addEventListener('click',() => addToQueue(button.id))
  })

  const covers = document.querySelectorAll('.song-item-artwork')
  covers.forEach((cover) => {
    cover.addEventListener('click', () => playSingleSong(cover.id))
  })
}

function renderAllAlbums(){
  library.innerHTML = ""
  albums.forEach(album => {
    albumItem = document.createElement('div')
    albumItem.classList.add('album-item')
    albumItem.innerHTML = `
    <div class="album-item">
      <div class="album-item-artwork" id="${album.fileName}">
         <img src="albumCovers/${album.fileName}.png">
      </div>
      <div class="album-item-title">
        ${album.name}
      </div>
      <div class="album-item-add" id=${album.fileName}>
        +
      </div>
    </div>
    `
    library.appendChild(albumItem)
  })
  
  const buttons = document.querySelectorAll('.album-item-add')
  buttons.forEach((button) => {
    button.addEventListener('click',() => addAlbumToQueue(button.id))
  })

  const covers = document.querySelectorAll('.album-item-artwork')
  covers.forEach((cover) => {
    cover.addEventListener('click', () => {
      resetPlayer()
      addAlbumToQueue(cover.id)
      playQueue()
    })
  })
}

function renderQueue(){
  queueDisplay.innerHTML =''
  for(let i = 0; i < queue.length; i++){
    for(let s = 0; s < songs.length; s++) {
      if(queue[i].id === songs[s].fileName){
        songItem = document.createElement('div')
        songItem.classList.add('song-item')
        songItem.innerHTML = `
        <div class="song-item">
          <div class="song-item-artwork"">
            <img src="albumCovers/${songs[s].album}.png">
          </div>
          <div class="queue-item-title" id="title${songs[s].fileName}">
            ${songs[s].title}
          </div>
          <div class="song-item-remove" id=${songs[s].fileName}>
            -
          </div>
        </div>
        `
        queueDisplay.appendChild(songItem)
      }
    }
  }

  const buttons = document.querySelectorAll('.song-item-remove')
  buttons.forEach((button) => {
    button.addEventListener('click', () => removeFromQueue(button.id))
  })
  highlightCurrentSong()
}

function highlightCurrentSong() {
  const titles = document.querySelectorAll('.queue-item-title')

  for(let i = 0; i < titles.length; i++){
    if(titles[i].id === `title${queue[currentSongNumber].id}`){
      titles[i].style.color = '#f0f';
    } else {
      titles[i].style.color = '#fff';
    }
  }
}

//
songLibraryButton.addEventListener('click', () => renderAllSongs())
albumLibraryButton.addEventListener('click', () => renderAllAlbums())
clearQueueButton.addEventListener('click', () => resetPlayer())