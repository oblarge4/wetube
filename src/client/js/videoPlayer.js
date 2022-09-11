const { format } = require("morgan");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currenTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const skipMinus = document.getElementById("skipMinus");
const skipPlus = document.getElementById("skipPlus");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = (e) => {
    if (video.muted) {
      video.muted = false;
    } else {
      video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
};
  
const handleVolumeChange = (event) => {
    const {
      target: { value },
    } = event;
    if (video.muted) {
      video.muted = false;
      muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTimeShot = (seconds) => new Date(seconds * 1000).toISOString().substring(14,19);
const formatTimeLong = (seconds) => new Date(seconds * 1000).toISOString().substring(11,19);

const handleLoadedMetadata = () => {
    const seconds = Math.floor(video.duration);
    if(seconds < 3600){
      totalTime.innerText = formatTimeShot(seconds);
    }else{
      totalTime.innerText = formatTimeLong(seconds);
    }    
    timeline.max = seconds;    
};
  
const handleTimeUpdate = () => {
    const seconds = Math.floor(video.currentTime);
    if(seconds < 3600){
      currenTime.innerText = formatTimeShot(seconds);
    }else{
      currenTime.innerText = formatTimeLong(seconds);
    }      
    timeline.value = seconds;
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
      document.exitFullscreen();
      fullScreenIcon.classList = "fas fa-expand";
    } else {
      videoContainer.requestFullscreen();
      fullScreenIcon.classList = "fas fa-compress";
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
      controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
  };
  
  const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
};

const handleSkipMinus = () => {
    video.currentTime -= 10;
};
  
  const handleSkipPlus = () => {
    video.currentTime += 10;
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
skipMinus.addEventListener("click", handleSkipMinus);
skipPlus.addEventListener("click", handleSkipPlus);
