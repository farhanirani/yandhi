const songs = [
  { title: "Selah", src: "songs/01 Selah.mp3" },
  { title: "The Storm", src: "songs/02 The Storm.mp3" },
  { title: "New Body", src: "songs/03 New Body.mp3" },
  { title: "Dreams", src: "songs/04 Dreams.mp3" },
  { title: "Simulation Baptize", src: "songs/05 Simulation Baptize.mp3" },
  { title: "Cash To Burn", src: "songs/06 Cash To Burn.mp3" },
  { title: "Bye Bye Baby", src: "songs/07 Bye Bye Baby.mp3" },
  { title: "Chakras", src: "songs/08 Chakras.mp3" },
  { title: "Hurricane", src: "songs/09 Hurricane.mp3" },
  { title: "Alien", src: "songs/10 Alien.mp3" },
  { title: "Ultimate Lie", src: "songs/11 Ultimate Lie.mp3" },
  { title: "Sky City", src: "songs/12 Sky City.mp3" },
  { title: "Brothers", src: "songs/13 Brothers.mp3" },
  { title: "We Got Love", src: "songs/14 We Got Love.mp3" },
  { title: "Last Name", src: "songs/15 Last Name.mp3" },
];

let current = 0;
let isPlaying = false;

let audio, progressBar, playBtn, playIcon, albumGlow, currTrackEl, currentTimeEl, totalTimeEl, playlist;

// ── Helpers ──────────────────────────────────────────────────

function formatTime(s) {
  if (isNaN(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function setSliderFill(slider, pct, colorA, colorB) {
  slider.style.background = `linear-gradient(to right, ${colorA} ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
}

// ── Load song into player ─────────────────────────────────────

function loadSong(index, autoPlay) {
  const song = songs[index];
  audio.src = song.src;
  audio.load();

  currTrackEl.textContent = song.title;
  document.title = song.title;
  currentTimeEl.textContent = "0:00";
  totalTimeEl.textContent = "0:00";

  progressBar.value = 0;
  setSliderFill(progressBar, 0, "#ff2d78", "rgba(255,255,255,0.1)");

  if (autoPlay) {
    audio.addEventListener("canplay", function onCanPlay() {
      audio.removeEventListener("canplay", onCanPlay);
      audio.play().catch(() => {});
    });
  }

  updatePlaylistActive();
  updateMediaSession(song);
}

// ── Play / Pause ──────────────────────────────────────────────

function setPlayingState(playing) {
  isPlaying = playing;
  if (playing) {
    playIcon.className = "fas fa-pause";
    playBtn.classList.add("is-playing");
    albumGlow.classList.add("playing");
  } else {
    playIcon.className = "fas fa-play";
    playBtn.classList.remove("is-playing");
    albumGlow.classList.remove("playing");
  }
  updatePlaylistActive();
  syncMediaSessionPlaybackState();
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(() => {});
  }
}

// ── Navigation ────────────────────────────────────────────────

function nextSong() {
  current = (current + 1) % songs.length;
  loadSong(current, isPlaying);
}

function prevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  current = (current - 1 + songs.length) % songs.length;
  loadSong(current, isPlaying);
}

function playSongAt(index) {
  current = index;
  loadSong(current, true);
}

function onTrackEnded() {
  if (current >= songs.length - 1) {
    setPlayingState(false);
    return;
  }
  current += 1;
  loadSong(current, true);
}

// ── Playlist UI ───────────────────────────────────────────────

function updatePlaylistActive() {
  const items = playlist.querySelectorAll(".playlist-item");
  items.forEach((item, i) => {
    const isActive = i === current;
    item.classList.toggle("active", isActive);
    item.classList.toggle("paused", isActive && !isPlaying);
  });
}

function buildPlaylist() {
  songs.forEach((song, i) => {
    const item = document.createElement("div");
    item.className = "playlist-item" + (i === 0 ? " active paused" : "");
    item.innerHTML = `
      <span class="track-num">${String(i + 1).padStart(2, "0")}</span>
      <span class="track-name-list">${song.title}</span>
      <div class="playing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    item.addEventListener("click", () => playSongAt(i));
    playlist.appendChild(item);
  });
}

// ── Media Session ─────────────────────────────────────────────

function updateMediaSession(song) {
  if (!("mediaSession" in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: "Kanye West",
    album: "YANDHI",
    artwork: [
      { src: "songs/cover.png", sizes: "96x96", type: "image/png" },
      { src: "songs/cover.png", sizes: "512x512", type: "image/png" },
    ],
  });
  syncMediaSessionPlaybackState();
}

function syncMediaSessionPlaybackState() {
  if (!("mediaSession" in navigator)) return;
  navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
}

function registerMediaSessionActions() {
  if (!("mediaSession" in navigator)) return;

  // iOS/Safari can throw for unsupported actions, so guard each one.
  const trySetAction = (action, handler) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch (_) {}
  };

  trySetAction("play", () => audio.play().catch(() => {}));
  trySetAction("pause", () => audio.pause());
  trySetAction("previoustrack", prevSong);
  trySetAction("nexttrack", nextSong);
}

// ── Init ──────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  audio = document.getElementById("main-audio");
  progressBar = document.getElementById("progress-bar");
  playBtn = document.getElementById("play-btn");
  playIcon = document.getElementById("play-icon");
  albumGlow = document.getElementById("album-glow");
  currTrackEl = document.getElementById("curr-track");
  currentTimeEl = document.getElementById("current-time");
  totalTimeEl = document.getElementById("total-time");
  playlist = document.getElementById("playlist");

  buildPlaylist();
  loadSong(0, false);

  // Audio events
  audio.addEventListener("play", () => setPlayingState(true));
  audio.addEventListener("pause", () => setPlayingState(false));
  audio.addEventListener("ended", onTrackEnded);

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.value = pct;
    setSliderFill(progressBar, pct, "#ff2d78", "rgba(255,255,255,0.1)");
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  // Seeking
  progressBar.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });

  // Control buttons
  playBtn.addEventListener("click", togglePlay);
  document.getElementById("prev-btn").addEventListener("click", prevSong);
  document.getElementById("next-btn").addEventListener("click", nextSong);

  // Keyboard
  document.addEventListener("keydown", (e) => {
    if (e.target !== document.body) return;
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    }
    if (e.code === "ArrowRight") {
      e.preventDefault();
      nextSong();
    }
    if (e.code === "ArrowLeft") {
      e.preventDefault();
      prevSong();
    }
  });

  // Media session actions
  registerMediaSessionActions();
});
