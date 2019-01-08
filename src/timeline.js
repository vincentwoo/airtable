import _ from 'lodash'
import moment from 'moment'
import CRTify from './crt'

const WIDTH = 800
const HEIGHT = 600
const TTY_WIDTH = 82
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
    this.firstDay = this.items[0].start
    this.lastDay = _.last(_.sortBy(this.items, 'end')).end
    this.numDays = this.lastDay.diff(this.firstDay, 'days')
    console.log(this.numDays)
    this.x = 0 // start rendering at the far left

    const bufferCanvas = document.createElement('canvas')
    canvas.width = bufferCanvas.width = WIDTH
    canvas.height = bufferCanvas.height = HEIGHT
    this.bufferContext = bufferCanvas.getContext('2d')
    // document.body.appendChild(bufferCanvas)
    this.prerendered = this._prerenderTracks(this.tracks)
    CRTify(canvas, this.bufferContext, WIDTH, HEIGHT)
    this.render()
  }

  render() {
    this.bufferContext.fillStyle = 'rgba(0, 0, 0, 0.75)'
    this.bufferContext.fillRect(0, 0, WIDTH, HEIGHT)
    this.bufferContext.font = `${FONT_SIZE}px monospace`
    this.bufferContext.fillStyle = '#00FF41'
    _.each(this._renderWindow(this.x), (row, idx) => {
      this.bufferContext.fillText(row, 5, 20 + idx * 1.5 * FONT_SIZE)
    })
    requestAnimationFrame(() => this.render())
  }

  forward() {
    this.x = Math.min(this.x + 2, (this.numDays + 2)  * CHARACTERS_PER_DAY - TTY_WIDTH)
  }

  backward() {
    this.x = Math.max(this.x - 2, 0)
  }

  // calculate the entire view once as an array of strings
  _prerenderTracks(tracks) {
    const rows = _.flatMap(tracks, track => {
      let rows = ['', '', '']
      for (const item of track) {
        const targetRowLength = item.firstDay * CHARACTERS_PER_DAY
        rows = rows.map(row => _.padEnd(row, targetRowLength))

        const maxNameLength = item.length * CHARACTERS_PER_DAY - 2
        const name = _.padEnd(_.truncate(item.name, {
          length: maxNameLength,
        }), maxNameLength)

        rows[0] += `+${_.repeat('-', name.length)}+`
        rows[1] += `|${name}|`
        rows[2] += `+${_.repeat('-', name.length)}+`
      }
      return rows
    })

    rows.unshift('', '')
    const curDay = this.firstDay.clone()
    for (let day = 0; day <= this.numDays; day++) {
      rows[0] += _.padEnd(curDay.format('MMM'), CHARACTERS_PER_DAY)
      rows[1] += _.padEnd(curDay.format('DD'), CHARACTERS_PER_DAY)
      curDay.add(1, 'days')
    }

    while (rows.length < TTY_HEIGHT) {
      rows.push('')
    }
    return rows
  }

  // prepare the shadow buffer window, with the left edge starting at char `x`
  _renderWindow(x) {
    const ret = this.prerendered.map(row => row.substr(x, TTY_WIDTH))
    ret[ret.length - 1] = _.padStart('Left/Right keys to scroll', TTY_WIDTH)
    return ret
  }

  _checkIntersect(item1, item2) {
    if (item1.start == item2.start || item1.end == item2.end) return false
    if (item1.start < item2.start) {
      return item2.start < item1.end
    } else {
      return item1.start < item2.end
    }
  }
}
