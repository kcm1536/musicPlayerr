const currentSongPhoto = document.querySelector('.current-song-photo')
const currentSongTitle = document.querySelector('.current-song-title')
const currentSongArtist = document.querySelector('.current-song-artist')
const skipBackButton = document.querySelector('.js-skip-back')
const playButton = document.querySelector('.js-play')
const skipForwardButton = document.querySelector('.js-skip-forward')
const loopButton = document.querySelector('.repeat-button-container')
const shuffleButton = document.querySelector('.shuffle-button')

let queue = []
let currentSongNumber = 0
let loopingSong = false
let loopingAll = false


function playQueue() {
  if (queue.length !== 0 && currentSongNumber < queue.length){

    queue[currentSongNumber].play()
    loadLyrics(queue[currentSongNumber].id)

    queue[currentSongNumber].removeEventListener('ended', handleSongEnd)
    queue[currentSongNumber].addEventListener('ended', handleSongEnd)

    queue[currentSongNumber].removeEventListener('timeupdate', updateProgressBar)
    queue[currentSongNumber].addEventListener('timeupdate', () => updateProgressBar(queue[currentSongNumber]))

    currentLyricNumber = 0
    updateInfoContainer()
    highlightCurrentSong()

    queue[currentSongNumber].removeEventListener('play', updatePlayButton)
    queue[currentSongNumber].addEventListener('play', updatePlayButton)

    queue[currentSongNumber].removeEventListener('pause', updatePlayButton)
    queue[currentSongNumber].addEventListener('pause', updatePlayButton)
  } else {
    currentSongNumber = 0
    updateInfoContainer()
    if(loopingAll){
      currentLyricNumber = 0
      playQueue()
    }
  }
} 

function handleSongEnd(){
  if(!loopingSong){
    currentSongNumber++
  }
  currentLyricNumber = 0
  playQueue()
}

function updateInfoContainer() {
  for(let i = 0; i < songs.length; i++){
    if(queue.length > 0){
      if(queue[currentSongNumber].id === songs[i].fileName){
        currentSongPhoto.src = `../albumCovers/${songs[i].album}.png`
        currentSongTitle.innerHTML = `${songs[i].title}`
        currentSongArtist.innerHTML = `${songs[i].artist}`
        
        break
      }
    } else {
      clearMusic()
      break
    }
  }
}

function clearMusic() {
  if (queue.length > 0) {
    queue.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
    });
  }
  
  queue = [];
  currentSongNumber = 0;
  playButton.src = '../icons/Play.png'
  renderQueue()
}

function resetPlayer() {
  clearMusic()
  targetAlbum = ''
  currentSongPhoto.src = `../albumCovers/noSong.png`
  currentSongTitle.innerHTML = `No song playing`
  currentSongArtist.innerHTML = `No song playing`
  previousTwoLyric.textContent = '...'
  previousOneLyric.textContent = '...'
  currentLyric.textContent = '...'
  nextOneLyric.textContent = '...'
  nextTwoLyric.textContent = '...'
  changePage('album-selection')
}

function pauseSong() {
  if(queue.length !== 0 && currentSongNumber < queue.length){
    if(queue[currentSongNumber].paused){
      queue[currentSongNumber].play()
      if (!intervalId) {
        loadLyrics(queue[currentSongNumber].id)
      }
      updatePlayButton()
      updateInfoContainer()
    } else {
      queue[currentSongNumber].pause()
      clearInterval(intervalId)
      intervalId = null
      updatePlayButton()
      updateInfoContainer()
    }
  }
}

function updatePlayButton() {
  if(queue.length > 0) {
    if(queue[currentSongNumber].paused){
      playButton.src = '../icons/Play.png'
    } else {
      playButton.src = '../icons/pause.png'
    }
  } else {
    clearMusic()
  }
}

function skipSong(num) {
  if (queue.length !== 0 && currentSongNumber < queue.length){
    if(queue[currentSongNumber].paused) {
      queue[currentSongNumber].pause()
      queue[currentSongNumber].currentTime = 0
      currentSongNumber += num
      if(currentSongNumber <= -1) {
        currentSongNumber = queue.length - 1
      }
      currentLyricNumber = 0
      playQueue()
      queue[currentSongNumber].pause()
    } else {
      queue[currentSongNumber].pause()
      queue[currentSongNumber].currentTime = 0
      currentSongNumber += num
      if(currentSongNumber <= -1) {
        currentSongNumber = queue.length - 1
      }
      currentLyricNumber = 0
      playQueue()
    }
  } else {
    currentSongNumber = 0
  }
}

function loop(){
  const loopingSongIcon = document.querySelector('.looping-song')
  const loopingAllIcon = document.querySelector('.looping-all')
  if(!loopingSong && !loopingAll){ // turning loop song on
    loopingSong = true
    loopingAll = false
    loopingSongIcon.style.display = 'block'
    loopingAllIcon.style.display = 'none'
  } else if(loopingSong && !loopingAll){ // turning loop all on
    loopingSong = false
    loopingAll = true
    loopingSongIcon.style.display = 'none'
    loopingAllIcon.style.display = 'block'
  } else if (!loopingSong && loopingAll){ // turning loop off
    loopingSong = false
    loopingAll = false
    loopingSongIcon.style.display = 'none'
    loopingAllIcon.style.display = 'none'
  }
}

function shuffle(){
  function shuffleHelper(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  }

  const shuffledQueue = shuffleHelper(queue.slice())
  clearMusic()
  shuffledQueue.forEach((song) => {
    let album;
    for(let i = 0; i < songs.length; i++){
      if(song.id === songs[i].fileName){
        album = songs[i].album 
        break
      }
    }
    song.src = `../music/${album}/${song.id}.m4a`
  })
  queue = shuffledQueue.slice()
  renderQueue()
  currentLyricNumber = 0
  playQueue()
}

// Event Listeners
skipBackButton.addEventListener('click', () => skipSong(-1))
skipForwardButton.addEventListener('click', () => skipSong(1))
playButton.addEventListener('click', () => pauseSong())
loopButton.addEventListener('click', () => loop())
shuffleButton.addEventListener('click', () => shuffle())