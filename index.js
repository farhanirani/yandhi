var current = 0;
var play = 1;
var titlename;

function playSong() {
  resetAll();
  audio_elements = document.body.getElementsByTagName("audio");
  audio_titles = document.body.getElementsByClassName("song__title");
  if (play == 1) {
    //if its in play mode

    if (current >= audio_elements.length) {
      current = 0;
    } else if (current < 0) {
      current = 15;
    }

    for (i = 0; i < audio_elements.length; i++) {
      audio_element = audio_elements[i];
      if (i == current) {
        audio_element.play();
        audio_titles = document.body.getElementsByClassName("song__title");
        document.title = audio_titles[i].innerHTML;
        document.getElementById("prev__track").innerHTML =
          audio_titles[getTrackNumber(i - 1)].innerHTML;
        document.getElementById("curr__track").innerHTML =
          audio_titles[i].innerHTML;
        document.getElementById("next__track").innerHTML =
          audio_titles[getTrackNumber(i + 1)].innerHTML;
      } else {
        audio_element.pause();
      }
    }
    play = 0; //to switch between play and pause
  } else {
    //if its in play mode

    for (i = 0; i < audio_elements.length; i++) {
      audio_elements[i].pause();
    }
    play = 1;
  }
}

function nextSong() {
  resetAll();
  current += 1;
  play = 1;
  playSong();
}

function prevSong() {
  resetAll();
  current -= 1;
  play = 1;
  playSong();
}

function onlyPlayOneIn(container) {
  container.addEventListener(
    "play",
    function (event) {
      audio_elements = container.getElementsByTagName("audio");
      for (i = 0; i < audio_elements.length; i++) {
        audio_element = audio_elements[i];
        if (audio_element !== event.target) {
          audio_element.pause();
        } else {
          current = i;
          audio_titles = document.body.getElementsByClassName("song__title");
          document.title = audio_titles[i].innerHTML;
          document.getElementById("prev__track").innerHTML =
            audio_titles[getTrackNumber(i - 1)].innerHTML;
          document.getElementById("curr__track").innerHTML =
            audio_titles[i].innerHTML;
          document.getElementById("next__track").innerHTML =
            audio_titles[getTrackNumber(i + 1)].innerHTML;
        }
      }
    },
    true
  );
}

function resetAll() {
  audio_elements = document.body.getElementsByTagName("audio");
  for (i = 0; i < audio_elements.length; i++) {
    if (i !== current) {
      audio_elements[i].currentTime = 0;
    }
  }
}

function autoPLay(container) {
  container.addEventListener(
    "ended",
    function (event) {
      audio_elements = container.getElementsByTagName("audio");
      for (i = 0; i < audio_elements.length; i++) {
        audio_element = audio_elements[i];
        if (i == audio_elements.length - 1) {
          current = 0;
          resetAll();
        } else {
          if (audio_element == event.target) {
            audio_elements[i + 1].play();
            current = i + 1;
            audio_titles = document.body.getElementsByClassName("song__title");
            document.title = audio_titles[i].innerHTML;
            document.getElementById("prev__track").innerHTML =
              audio_titles[getTrackNumber(i - 1)].innerHTML;
            document.getElementById("curr__track").innerHTML =
              audio_titles[i].innerHTML;
            document.getElementById("next__track").innerHTML =
              audio_titles[getTrackNumber(i + 1)].innerHTML;
          }
        }
      }
    },
    true
  );
}

function ChangeVolume(currentVol) {
  audio_elements = document.body.getElementsByTagName("audio");
  for (i = 0; i < audio_elements.length; i++) {
    audio_elements[i].volume = currentVol / 100;
  }
}

function getTrackNumber(i) {
  if (i > 14) return 0;
  else if (i < 0) return 14;
  else return i;
}

// INITIAL *****************************************
document.addEventListener("DOMContentLoaded", function () {
  onlyPlayOneIn(document.body);
  autoPLay(document.body);
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    playSong();
  }
});

window.onkeydown = function (e) {
  return !(e.keyCode == 32);
};

// INITIAL *****************************************

// for the phone notification( puse next previous)
if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("previoustrack", function () {
    prevSong();
  });

  navigator.mediaSession.setActionHandler("nexttrack", function () {
    nextSong();
  });

  navigator.mediaSession.metadata = new MediaMetadata({
    title: titlename,
    artist: "Kanye West",
    album: "YANDHI",
    artwork: [
      { src: "songs/cover.png", sizes: "96x96", type: "image/png" },
      { src: "songs/cover.png", sizes: "128x128", type: "image/png" },
      { src: "songs/cover.png", sizes: "192x192", type: "image/png" },
      { src: "songs/cover.png", sizes: "256x256", type: "image/png" },
      { src: "songs/cover.png", sizes: "384x384", type: "image/png" },
      { src: "songs/cover.png", sizes: "512x512", type: "image/png" },
    ],
  });
}
