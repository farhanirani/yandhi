function onlyPlayOneIn(container) {
  container.addEventListener("play", function(event) {
    audio_elements = container.getElementsByTagName("audio")
    for(i=0; i < audio_elements.length; i++) {
      audio_element = audio_elements[i];
      if (audio_element !== event.target) {
        audio_element.pause();
      }
    }
  }, true);
}

function autoPLay(container) {
  container.addEventListener("ended", function(event) {
    audio_elements = container.getElementsByTagName("audio")
    for(i=0; i < audio_elements.length; i++) {
      audio_element = audio_elements[i];
      if (audio_element == event.target) {
        audio_elements[i+1].play();
      }
    }
  }, true);
}


  
document.addEventListener("DOMContentLoaded", function() {
  onlyPlayOneIn(document.body);
  autoPLay(document.body);
});
