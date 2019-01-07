import './index.css'

import Timeline from './timeline'
import timelineItems from './timelineItems'

const timeline = new Timeline(timelineItems, document.getElementById('terminal'))

window.onkeydown = function(event) {
  if (event.key == 'ArrowRight') {
    timeline.forward()
  } else if (event.key == 'ArrowLeft') {
    timeline.backward()
  }
}
