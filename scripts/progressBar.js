const progressBar = document.querySelector('.progress-bar')
const progressBarContainer = document.querySelector('.progress-bar-container')
const currentSongTimeDisplay = document.createElement('div')
const currentSongLengthDisplay = document.createElement('div')


let currentSongTimeValue
let currentSongLengthValue

function updateProgressBar(song) {
  if(song){
    let currentSongTime = song.currentTime
    let currentSongLength = song.duration
    let progressPercentage = (currentSongTime / currentSongLength) * 100
    progressBar.style.width = `${progressPercentage}%`

    currentSongTimeValue = formatSeconds(currentSongTime)
    currentSongTimeDisplay.classList.add('current-song-time-display')
    currentSongTimeDisplay.innerHTML = currentSongTimeValue

    currentSongLengthValue = formatSeconds(currentSongLength)
    currentSongLengthDisplay.classList.add('current-song-length-display')
    currentSongLengthDisplay.innerHTML = currentSongLengthValue


  } else {
    progressBar.style.width = '100%'
    hideProgressBar()
  }
}

function enterProgressBar() {
  if(queue[currentSongNumber]) {
      progressBarContainer.style.height = '4dvh'
      progressBarContainer.style.cursor = 'pointer'
      progressBar.style.cursor = 'pointer'

      progressBarContainer.appendChild(currentSongTimeDisplay)
      progressBarContainer.appendChild(currentSongLengthDisplay)
  }
}

function exitProgressBar() {
  if(queue[currentSongNumber]) {
    progressBarContainer.style.height = '1dvh'
    progressBarContainer.style.cursor = 'default'
    progressBar.style.cursor = 'default'

    progressBarContainer.removeChild(currentSongTimeDisplay)
    progressBarContainer.removeChild(currentSongLengthDisplay)
  }
}

function hideProgressBar() {
  progressBarContainer.style.height = '1dvh'
  progressBarContainer.style.cursor = 'default'
  progressBar.style.cursor = 'default'

  progressBarContainer.appendChild(currentSongTimeDisplay)
  progressBarContainer.appendChild(currentSongLengthDisplay)
  progressBarContainer.removeChild(currentSongTimeDisplay)
  progressBarContainer.removeChild(currentSongLengthDisplay)
}

function seekProgressBar(e) {
  const songPercentage = Math.floor((e.x / window.screen.width) * 100)
  queue[currentSongNumber].currentTime = queue[currentSongNumber].duration * (songPercentage / 100)
}

function formatSeconds(seconds) {
  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}


// Event Listeners
progressBarContainer.addEventListener('mouseenter', () => enterProgressBar())
progressBarContainer.addEventListener('mouseleave', () => exitProgressBar())
progressBarContainer.addEventListener('click', (e) => seekProgressBar(e))