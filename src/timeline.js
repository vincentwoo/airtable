import _ from 'lodash'
import moment from 'moment'
import CRTify from './crt'

const WIDTH = 800
const HEIGHT = 600
const TTY_WIDTH = 83
const TTY_HEIGHT = 24
const FONT_SIZE = 16
const CHARACTERS_PER_DAY = 4

export default class Timeline {
  constructor(items, canvas) {
    // canonicalize data with the blunt hammer that is moment.js
    this.items = _.sortBy(items, 'start')
    for (const item of this.items) {
      item.start = moment(item.start) // mutate the original data like some caveman
      item.end = moment(item.end)
      item.length = item.end.diff(item.start, 'days')
      item.firstDay = item.start.diff(items[0].start, 'days')
      item.lastDay = item.firstDay + item.length
    }

    // analyze and sort items by track, using like, math or something
    this.tracks = []
    for (const item of this.items) {
      let inserted = false
      for (const track of this.tracks) {
        if (!this._checkIntersect(item, track[track.length - 1])) {
          track.push(item)
          inserted = true
          break
        }
      }
      if (!inserted) this.tracks.push([item])
    }

    this.x = 0 // start rendering at the far left
    canvas.style.width = WIDTH + 'px'
    canvas.style.height = HEIGHT + 'px'
    const bufferCanvas = document.createElement('canvas')
    bufferCanvas.width = WIDTH
    bufferCanvas.height = HEIGHT
    this.bufferContext = bufferCanvas.getContext('2d')
    document.body.appendChild(bufferCanvas)
    this.domElement = document.createElement('pre')
    this.prerendered = this._prerenderTracks(this.tracks)
    this.render()

    CRTify(canvas, this.bufferContext, WIDTH, HEIGHT)
  }

  render() {
    this.domElement.innerHTML = this._renderWindow(this.x)
    this._copyDOMtoCanvas(this.domElement, this.bufferContext)
  }

  forward() {
    this.x += 2
    this.render()
  }

  backward() {
    this.x = Math.max(this.x - 2, 0)
    this.render()
  }

  // calculate the entire view once as an array of strings
  _prerenderTracks(tracks) {
    return _.flatMap(tracks, track => {
      let rows = ['', '', '']
      for (const item of track) {
        const targetRowLength = item.firstDay * CHARACTERS_PER_DAY
        if (rows[0].length < targetRowLength) {
          rows = rows.map(row => row + _.repeat(' ', targetRowLength - row.length))
        }

        const maxNameLength = item.length * CHARACTERS_PER_DAY - 2
        const name = item.name.length < maxNameLength
          ? item.name + _.repeat(' ', maxNameLength - item.name.length)
          : item.name.substr(0, maxNameLength - 3) + '...'

        rows[0] += `+${_.repeat('-', name.length)}+`
        rows[1] += `|${name}|`
        rows[2] += `+${_.repeat('-', name.length)}+`
      }
      return rows
    })
  }

  // prepare the shadow <pre> buffer window, with the left edge starting at char `x`
  _renderWindow(x) {
    return this.prerendered.map(row => row.substr(x, TTY_WIDTH)).join("\n")
  }

  _checkIntersect(item1, item2) {
    if (item1.start == item2.start || item1.end == item2.end) return false
    if (item1.start < item2.start) {
      return item2.start < item1.end
    } else {
      return item1.start < item2.end
    }
  }

  _copyDOMtoCanvas(element, ctx) {
    const img = new Image()
    img.addEventListener('load', function() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT)
      ctx.drawImage(img, 0, 0)
    }, false)
    img.src = `data:image/svg+xml;charset=utf-8,
      <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}px" height="${HEIGHT}px">
        <foreignObject width="100%" height="100%">
          <pre xmlns="http://www.w3.org/1999/xhtml"
            style="margin: 0; padding: 0; color: #00FF41; font: bold ${FONT_SIZE}px monospace;"
          >${element.innerHTML}</pre>
        </foreignObject>
      </svg>`
  }
}