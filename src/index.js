import timelineItems from './timelineItems'
import _ from 'lodash'
import moment from 'moment'
import Terminal from 'xterm'

const items = _.sortBy(timelineItems, 'start')
for (const item of items) {
  item.start = moment(item.start)
  item.end = moment(item.end)
  item.length = item.end.diff(item.start, 'days')
  item.offset = item.start.diff(items[0].start, 'days')
}
