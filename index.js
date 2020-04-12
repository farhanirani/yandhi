var current = 0

function playSong() {
  resetAll();
  audio_elements = document.body.getElementsByTagName("audio")
  if (current >= audio_elements.length) {
    current = 0
  }
  for(i=0; i < audio_elements.length; i++) {
    audio_element = audio_elements[i];
    if (i == current) {
      audio_element.play();
    } else {
      audio_element.pause();
    }
  }
}


function pauseSong() {
  audio_elements = document.body.getElementsByTagName("audio")
  for(i=0; i < audio_elements.length; i++) {
    audio_elements[i].pause();
    }
  }


function onlyPlayOneIn(container) {
  container.addEventListener("play", function(event) {
    audio_elements = container.getElementsByTagName("audio")
    for(i=0; i < audio_elements.length; i++) {
      audio_element = audio_elements[i];
      if (audio_element !== event.target) {
        audio_element.pause();
      } else {
        current = i;
      }
    }
  }, true);
}

function resetAll() {
  audio_elements = document.body.getElementsByTagName("audio")
  for(i=0; i < audio_elements.length; i++) {
    if( i !== current){
      audio_elements[i].currentTime = 0;
    }
  }
}


function autoPLay(container) {
  container.addEventListener("ended", function(event) {
    audio_elements = container.getElementsByTagName("audio")
    for(i=0; i < audio_elements.length; i++) {
      audio_element = audio_elements[i];
      if( i == audio_elements.length-1) {
        current = 0
        resetAll();
      } else {
        if (audio_element == event.target) {
          audio_elements[i+1].play();
          current = i+1;
        }
      }
    }
  }, true);
}


  
document.addEventListener("DOMContentLoaded", function() {
  onlyPlayOneIn(document.body);
  autoPLay(document.body);
});
