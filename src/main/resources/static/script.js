function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    if (i < 4) {
      color += letters[Math.floor(Math.random() * 8)];
    } else {
      color += letters[Math.floor(Math.random() * 11)];
    }
  }
  return color;
}

function setRandomGradient() {
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  document.body.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
}

let currentAudio = null;
let isPlaying = false;
let currentSongIndex = 0;
let playlist = [1, 2, 3, 4, 5, 6].map((num) => num.toString().padStart(2, "0"));
let shuffledPlaylist = [...playlist];

let audioElement = null;

function setupAudioPlayer() {
  const playButtons = document.querySelectorAll(".play-btn");
  const mainPlayPauseBtn = document.querySelector(".play-pause");
  const progressBar = document.querySelector(".progress");
  const volumeSlider = document.querySelector(".volume-progress");

  audioElement = new Audio();
  audioElement.src = "media/01.mp3";

  audioElement.addEventListener("timeupdate", () => {
    const progress = (audioElement.currentTime / audioElement.duration) * 100;
    progressBar.style.width = `${progress}%`;
  });

  volumeSlider.addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    const volume = (e.clientX - rect.left) / rect.width;
    audioElement.volume = volume;
    volumeSlider.style.width = `${volume * 100}%`;
  });

  mainPlayPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
      audioElement.pause();
      mainPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
      audioElement.play();
      mainPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
  });

  playButtons.forEach((button, index) => {
    button.addEventListener("click", async (e) => {
      e.stopPropagation();
      const card = button.closest(".music-card");
      const thumbnail = card.querySelector(".thumbnail img").src;
      const title = card.querySelector("h3").textContent;
      const artist = card.querySelector("p").textContent;

      if (isPlaying && currentSongIndex === index) {
        audioElement.pause();
        isPlaying = false;
        button.innerHTML = '<i class="fas fa-play"></i>';
        mainPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        return;
      }

      const songNumber = (index + 1).toString().padStart(2, "0");
      audioElement.src = `media/${songNumber}.mp3`;
      currentSongIndex = index;

      const nowPlayingImg = document.querySelector(".now-playing img");
      const nowPlayingTitle = document.querySelector(".now-playing h4");
      const nowPlayingArtist = document.querySelector(".now-playing p");
      nowPlayingImg.src = thumbnail;
      nowPlayingTitle.textContent = title;
      nowPlayingArtist.textContent = artist;

      try {
        await audioElement.play();
        button.innerHTML = '<i class="fas fa-pause"></i>';
        mainPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
      } catch (error) {
        console.error("Playback failed:", error);
        isPlaying = false;
        button.innerHTML = '<i class="fas fa-play"></i>';
        mainPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  });

  const musicCards = document.querySelectorAll(".music-card");
  const nowPlayingImg = document.querySelector(".now-playing img");
  const nowPlayingTitle = document.querySelector(".now-playing h4");
  const nowPlayingArtist = document.querySelector(".now-playing p");

  musicCards.forEach((card, index) => {
    card.addEventListener("click", async () => {
      const thumbnail = card.querySelector(".thumbnail img").src;
      const title = card.querySelector("h3").textContent;
      const artist = card.querySelector("p").textContent;

      if (isPlaying) {
        audioElement.pause();
        const playButtons = document.querySelectorAll(".play-btn");
        playButtons.forEach(
          (btn) => (btn.innerHTML = '<i class="fas fa-play"></i>')
        );
        mainPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }

      const songNumber = (index + 1).toString().padStart(2, "0");
      audioElement.src = `media/${songNumber}.mp3`;

      nowPlayingImg.src = thumbnail;
      nowPlayingTitle.textContent = title;
      nowPlayingArtist.textContent = artist;

      try {
        audioElement.currentTime = 0;
        await audioElement.play();
        isPlaying = true;
        mainPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

        const playButtons = document.querySelectorAll(".play-btn");
        playButtons.forEach((btn) => {
          if (btn.closest(".music-card") === card) {
            btn.innerHTML = '<i class="fas fa-pause"></i>';
          } else {
            btn.innerHTML = '<i class="fas fa-play"></i>';
          }
        });
      } catch (error) {
        console.error("Playback failed:", error);
        isPlaying = false;
        mainPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      }
    });
  });
}

async function playSong(index) {
  const songNumber = isShuffle ? shuffledPlaylist[index] : playlist[index];
  const cards = document.querySelectorAll(".music-card");
  const cardIndex = parseInt(songNumber) - 1;
  const card = cards[cardIndex];

  if (!card) return;

  const thumbnail = card.querySelector(".thumbnail img").src;
  const title = card.querySelector("h3").textContent;
  const artist = card.querySelector("p").textContent;

  audioElement.src = `media/${songNumber}.mp3`;
  currentSongIndex = index;

  const nowPlayingImg = document.querySelector(".now-playing img");
  const nowPlayingTitle = document.querySelector(".now-playing h4");
  const nowPlayingArtist = document.querySelector(".now-playing p");
  nowPlayingImg.src = thumbnail;
  nowPlayingTitle.textContent = title;
  nowPlayingArtist.textContent = artist;

  try {
    await audioElement.play();
    isPlaying = true;
    updatePlayPauseButtons();
  } catch (error) {
    console.error("Playback failed:", error);
    isPlaying = false;
    updatePlayPauseButtons();
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.addEventListener("DOMContentLoaded", () => {
  setRandomGradient();
  setupAudioPlayer();

  const shuffleBtn = document.querySelector(".shuffle-btn");
  const repeatBtn = document.querySelector(".repeat-btn");
  const prevBtn = document.querySelector(".fa-step-backward").parentElement;
  const nextBtn = document.querySelector(".fa-step-forward").parentElement;
  let isShuffle = false;
  let repeatMode = 0;

  prevBtn.addEventListener("click", () => {
    if (!audioElement || !audioElement.duration) return;

    if (audioElement.currentTime >= 5) {
      audioElement.currentTime = 0;
      if (!isPlaying) {
        audioElement.play();
        isPlaying = true;
        updatePlayPauseButtons();
      }
    } else {
      let newIndex;
      if (isShuffle) {
        newIndex = currentSongIndex - 1;
        if (newIndex < 0) {
          newIndex = shuffledPlaylist.length - 1;
        }
      } else {
        newIndex = currentSongIndex - 1;
        if (newIndex < 0) {
          newIndex = playlist.length - 1;
        }
      }
      playSong(newIndex);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!audioElement || !audioElement.duration) return;

    let newIndex;
    if (isShuffle) {
      newIndex = currentSongIndex + 1;
      if (newIndex >= shuffledPlaylist.length) {
        newIndex = 0;
      }
    } else {
      newIndex = currentSongIndex + 1;
      if (newIndex >= playlist.length) {
        newIndex = 0;
      }
    }
    playSong(newIndex);
  });

  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? "#ff0000" : "white";
    if (isShuffle) {
      shuffledPlaylist = shuffleArray([...playlist]);
    }
  });

  repeatBtn.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;
    updateRepeatButton();
  });

  audioElement.addEventListener("ended", () => {
    if (repeatMode === 2) {
      audioElement.currentTime = 0;
      audioElement.play();
      console.log("Repeat One: Replaying current track");
    } else {
      let newIndex;
      if (isShuffle) {
        newIndex = currentSongIndex + 1;
        if (newIndex >= shuffledPlaylist.length) {
          if (repeatMode === 1) {
            newIndex = 0;
            console.log("Repeat All: Restarting shuffled playlist");
          } else {
            newIndex = -1;
            console.log("No Repeat: Reached end of shuffled playlist");
          }
        }
      } else {
        newIndex = currentSongIndex + 1;
        if (newIndex >= playlist.length) {
          if (repeatMode === 1) {
            newIndex = 0;
            console.log("Repeat All: Restarting playlist");
          } else {
            newIndex = -1;
            console.log("No Repeat: Reached end of playlist");
          }
        }
      }

      if (newIndex !== -1) {
        console.log(`Playing next song at index: ${newIndex}`);
        playSong(newIndex);
      } else {
        isPlaying = false;
        updatePlayPauseButtons();
      }
    }
  });

  function updatePlayPauseButtons() {
    const mainPlayPauseBtn = document.querySelector(".play-pause");
    const playButtons = document.querySelectorAll(".play-btn");

    if (isPlaying) {
      mainPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      playButtons[currentSongIndex].innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      mainPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      playButtons.forEach(
        (btn) => (btn.innerHTML = '<i class="fas fa-play"></i>')
      );
    }
  }

  function updateRepeatButton() {
    if (repeatMode === 0) {
      repeatBtn.style.color = "white";
      repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    } else if (repeatMode === 1) {
      repeatBtn.style.color = "#ff0000";
      repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    } else if (repeatMode === 2) {
      repeatBtn.style.color = "#ff0000";
      repeatBtn.innerHTML =
        '<i class="fas fa-redo"></i><span style="font-size: 0.7em; font-weight:bold; margin-left: -1px; position: relative; bottom: -2px;">1</span>';
    }
    console.log("Repeat Mode:", repeatMode);
  }

  const progressBar = document.querySelector(".progress-bar");
  const progress = document.querySelector(".progress");
  const volumeSlider = document.querySelector(".volume-slider");
  const volumeProgress = document.querySelector(".volume-progress");
  const volumeIcon = document.querySelector(".volume-controls i");
  let previousVolume = 1;

  audioElement.volume = 0.7;
  volumeProgress.style.width = "70%";

  audioElement.addEventListener("timeupdate", () => {
    const progressWidth =
      (audioElement.currentTime / audioElement.duration) * 100;
    progress.style.width = `${progressWidth}%`;
  });

  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audioElement.duration;
    audioElement.currentTime = newTime;
  });

  let isDraggingProgress = false;

  progressBar.addEventListener("mousedown", (e) => {
    isDraggingProgress = true;
    updateProgressBar(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingProgress) {
      updateProgressBar(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isDraggingProgress = false;
  });

  function updateProgressBar(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const newTime = (clickX / rect.width) * audioElement.duration;
    audioElement.currentTime = newTime;
    progress.style.width = `${(newTime / audioElement.duration) * 100}%`;
  }

  let isDraggingVolume = false;

  volumeSlider.addEventListener("mousedown", (e) => {
    isDraggingVolume = true;
    updateVolumeSlider(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDraggingVolume) {
      updateVolumeSlider(e);
    }
  });

  document.addEventListener("mouseup", () => {
    isDraggingVolume = false;
  });

  function updateVolumeSlider(e) {
    const rect = volumeSlider.getBoundingClientRect();
    const clickX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const newVolume = clickX / rect.width;

    audioElement.volume = newVolume;
    volumeProgress.style.width = `${newVolume * 100}%`;
    updateVolumeIcon(newVolume);
  }

  volumeIcon.addEventListener("click", () => {
    if (audioElement.volume > 0) {
      previousVolume = audioElement.volume;
      audioElement.volume = 0;
      volumeProgress.style.width = "0%";
      volumeIcon.className = "fas fa-volume-mute";
    } else {
      audioElement.volume = previousVolume;
      volumeProgress.style.width = `${previousVolume * 100}%`;
      updateVolumeIcon(previousVolume);
    }
  });

  function updateVolumeIcon(volume) {
    if (volume === 0) {
      volumeIcon.className = "fas fa-volume-mute";
    } else if (volume < 0.5) {
      volumeIcon.className = "fas fa-volume-down";
    } else {
      volumeIcon.className = "fas fa-volume-up";
    }
  }

  volumeSlider.addEventListener("wheel", (e) => {
    e.preventDefault();
    const currentVolume = audioElement.volume;
    const volumeChange = e.deltaY > 0 ? -0.05 : 0.05;
    const newVolume = Math.min(Math.max(currentVolume + volumeChange, 0), 1);

    audioElement.volume = newVolume;
    volumeProgress.style.width = `${newVolume * 100}%`;
    updateVolumeIcon(newVolume);
  });

  const categoryChips = document.querySelector(".category-chips");
  const leftScrollBtn = document.querySelector(".chip-scroll-btn.left");
  const rightScrollBtn = document.querySelector(".chip-scroll-btn.right");

  const scrollAmount = 300;

  leftScrollBtn.addEventListener("click", () => {
    categoryChips.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  });

  rightScrollBtn.addEventListener("click", () => {
    categoryChips.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  });

  const updateScrollButtons = () => {
    leftScrollBtn.style.display =
      categoryChips.scrollLeft > 0 ? "flex" : "none";
    rightScrollBtn.style.display =
      categoryChips.scrollLeft <
      categoryChips.scrollWidth - categoryChips.clientWidth
        ? "flex"
        : "none";
  };

  categoryChips.addEventListener("scroll", updateScrollButtons);
  window.addEventListener("resize", updateScrollButtons);

  updateScrollButtons();
});
