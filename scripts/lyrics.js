const previousTwoLyric = document.querySelector('.previous-two-lyric');
const previousOneLyric = document.querySelector('.previous-one-lyric');
const currentLyric = document.querySelector('.current-lyric');
const nextOneLyric = document.querySelector('.next-one-lyric');
const nextTwoLyric = document.querySelector('.next-two-lyric');

let currentSongLrc = []
let currentLyricNumber = 0
let intervalId

function displayLyrics() {
  if (currentSongLrc.length < 5) {
    console.error('Not enough lyrics to display');
    return;
  }

  previousTwoLyric.textContent = currentSongLrc[currentLyricNumber - 2]?.text || '...'
  previousOneLyric.textContent = currentSongLrc[currentLyricNumber -1]?.text || '...'
  currentLyric.textContent = currentSongLrc[currentLyricNumber]?.text || '...';
  nextOneLyric.textContent = currentSongLrc[currentLyricNumber + 1]?.text || '...';
  nextTwoLyric.textContent = currentSongLrc[currentLyricNumber + 2]?.text || '...';

  updateLyrics()
}

async function updateLyrics() {
  if(queue.length === 0){ // when no songs play, end loop and reset player
    clearInterval(intervalId);
    resetPlayer()
    return
  }
  if (queue[currentSongNumber].paused) { // stop the loop if paused
    clearInterval(intervalId);
    return;
  }
  // if we are on the last lyric stops the rest running
  // should only be ran when we run the function for the last time manually in the while loop below
  if(currentLyricNumber === currentSongLrc.length - 1){
    clearInterval(intervalId)
    intervalId = null
    return
  }
  let currentTime = (queue[currentSongNumber].currentTime) * 1000 // calculates current time in song
  let nextLyricTime = currentSongLrc[currentLyricNumber + 1].timestamp - 500 // calculates time of next lyric
  let previousLyricTime // creating variable for later reassignment
  if(currentLyricNumber === 0){
    // sets previous lyric to start if we are at the starts
    // to avoid error where the timestamp does not exist
    previousLyricTime = currentSongLrc[0].timestamp - 500
  } else {
    previousLyricTime = currentSongLrc[currentLyricNumber - 1].timestamp - 500 // calculates time of last lyric
  }
  if(currentTime < previousLyricTime){ // only returns true if we skip back
    while(currentTime < previousLyricTime){
      currentLyricNumber-- // update lyric number for when we call display lyrics
      // checks if we are on the last line
      // manually calls the displayLyrics then clears its loop and exits if we are, else ignored
      if(currentLyricNumber >= currentSongLrc.length - 1){
        displayLyrics()
        clearInterval(intervalId)
        intervalId = null
        return
      }
      // if we dont enter if statements, updates current time and previous lyric time so we can exit loop
      currentTime = (queue[currentSongNumber].currentTime) * 1000
      previousLyricTime = currentSongLrc[currentLyricNumber - 1].timestamp - 500
    }
  }
  while(currentTime > nextLyricTime){ // if time is bigger than next lyric (we are past it)
    currentLyricNumber++ // update lyric number for when we call display lyrics
    // checks if we are on the last line
    // manually calls the displayLyrics then clears its loop and exits if we are else ignored
    if(currentLyricNumber >= currentSongLrc.length - 1){
      displayLyrics()
      clearInterval(intervalId)
      intervalId = null
      return
    }
    // if we dont enter if statements, updates current time and next lyric time so we can exit loop
    currentTime = (queue[currentSongNumber].currentTime) * 1000
    nextLyricTime = currentSongLrc[currentLyricNumber + 1].timestamp - 500
  }
  // ensures that if we're at the start of the song and not yet in first line, it displays correctly
  // added to fix error where skipping to the start shows currentTime > previousLyricTime as previous lyric was start so pushes to next line early
  if(previousLyricTime === -500 & currentTime < (currentSongLrc[1].timestamp - 500)){
    currentLyricNumber = 0
  }
  await new Promise(resolve => setTimeout(resolve, 100)); // waits then allows display lyrics to be called
}

function parseLRC(lrcContent) {
  const lines = lrcContent.split('\n');
  const lyrics = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{3})\]/;

  lines.forEach(line => {
      const match = line.match(timeRegex);
      if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseInt(match[2], 10);
          const milliseconds = parseInt(match[3], 10);
          const lyricsText = line.replace(timeRegex, '').trim();
          const timestamp = (minutes * 60 + seconds) * 1000 + milliseconds;
          lyrics.push({ timestamp, text: lyricsText });
      }
  });

  return lyrics;
}

async function fetchLRC(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const lrcContent = await response.text();
      return lrcContent;
  } catch (error) {
      return null;
  }
}

async function loadLyrics(id) {
  let album;
  for(let i = 0; i < songs.length; i++){
    if(songs[i].fileName === id){
      album = songs[i].album;
      break;
    }
  }
  const url = `../lrcFiles/${album}/${id}.lrc`;
  const lrcContent = await fetchLRC(url);
  if (lrcContent) {
      currentSongLrc = parseLRC(lrcContent);
      if(intervalId) {
        clearInterval(intervalId)
      }

      intervalId = setInterval(displayLyrics, 100)
  } else {
    if(intervalId) {
      clearInterval(intervalId)
    }
    previousTwoLyric.textContent = '...'
    previousOneLyric.textContent = '...'
    currentLyric.textContent = 'No lyrics available'
    nextOneLyric.textContent = '...'
    nextTwoLyric.textContent = '...'
  }
}
