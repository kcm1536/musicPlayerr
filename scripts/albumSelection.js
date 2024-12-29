const albumViewExitButton = document.querySelector('.album-view-exit')

let targetAlbum

function playAlbum(album) {
  clearMusic()
  for(let i = 1; i < album.albumLength + 1; i++){
    song = new Audio(`../music/${album.fileName}/${album.fileName}${i}.m4a`)
    song.id = `${album.fileName}${i}`
    queue.push(song)
  }

  currentSongNumber = 0
  playQueue()
}

function loadAlbumView(album){
  changePage('album')
  targetAlbum = album
  const albumViewImg = document.querySelector('.album-view-image')
  const albumViewTitle = document.querySelector('.album-view-title')
  const albumViewArtist = document.querySelector('.album-view-artist')

  albumViewImg.src = `../albumCovers/${album.fileName}.png`
  albumViewTitle.innerHTML = `${album.name}`
  albumViewArtist.innerHTML = `${album.artist}`

  albumViewImg.removeEventListener('click', addAlbumToQueue)
  albumViewImg.addEventListener('click', () => addAlbumToQueue(album.fileName))

  const albumViewPlayControls = document.querySelector('.album-view-play-controls')
  albumViewPlayControls.innerHTML = ''

  const albumViewPlayButton = document.createElement('button')
  albumViewPlayButton.classList.add('album-view-play-button')
  albumViewPlayButton.innerHTML = 'Play'
  albumViewPlayControls.appendChild(albumViewPlayButton)

  albumViewPlayButton.addEventListener('click', () => playAlbum(album))

  const albumViewShuffleButton = document.createElement('button')
  albumViewShuffleButton.classList.add('album-view-shuffle-button')
  albumViewShuffleButton.innerHTML = 'Shuffle'
  albumViewPlayControls.appendChild(albumViewShuffleButton)

  albumViewShuffleButton.addEventListener('click', () => {
    addAlbumToQueue(album.fileName)
    shuffle()
  })
  
  loadAlbumViewSongs(album)
}

function loadAlbumViewSongs(album) {
  const albumSongsContainer = document.querySelector('.album-songs-container') 
  albumSongsContainer.innerHTML = ''
  let songNumber = 0

  for(let i = 0; i < songs.length; i++) {
    if(album.fileName === songs[i].album){
      songNumber++
      const albumSongItem = document.createElement('div')
      albumSongItem.classList.add('album-song-item')
      albumSongItem.innerHTML=`
      <div class="album-song-item-number">${songNumber}</div>
      <div class="album-song-item-cover-container">
        <img class="album-song-item-cover" id="${songs[i].fileName}" src="../albumCovers/${songs[i].album}.png">
      </div>
      <div class="album-song-item-title">${songs[i].title}</div>
      <div class="album-song-item-add" id="${songs[i].fileName}">+</div>
      `
      albumSongsContainer.append(albumSongItem)
    } 
  }

  const covers = document.querySelectorAll('.album-song-item-cover')
  covers.forEach((cover) => {
    cover.addEventListener('click', () => playSingleSong(cover.id))
  })

  const buttons = document.querySelectorAll('.album-song-item-add')
  buttons.forEach((button) => {
    button.addEventListener('click', () => addToQueue(button.id))
  })
}

function exitAlbumView () {
  targetAlbum = ''
  changePage('album-selection')
}

albumViewExitButton.addEventListener('click', () => exitAlbumView())