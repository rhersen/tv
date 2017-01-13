const foreach = require('lodash.foreach')
const groupby = require('lodash.groupby')
const map = require('lodash.map')
const maxby = require('lodash.maxby')

const formatAnnouncement = require('./formatAnnouncement')
const position = require('./position')

function getHtml(announcements, stationNames) {
    let s = '<div id="sheet">'

    if (announcements.length) {
        const a = announcements[0]
        s += '<div class="train">'
        s += `<a href="javascript:getTrain(${a.AdvertisedTrainIdent})">`
        s += a.AdvertisedTrainIdent
        s += '</a>'
        s += '</div>'
    }

    s += '<table>'

    const now = Date.now()

    foreach(announcements, a => {
        s += `${formatAnnouncement(a, now, stationNames)}`
    })

    s += '</table>'
    s += '</div>'
    return s
}

module.exports = getHtml
