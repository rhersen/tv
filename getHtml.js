const foreach = require('lodash.foreach')
const groupby = require('lodash.groupby')
const map = require('lodash.map')
const maxby = require('lodash.maxby')

const formatLatestAnnouncement = require('./formatLatestAnnouncement')
const position = require('./position')

function getHtml(announcements, stationNames) {
    let s = '<div id="sheet">'

    if (announcements.length) {
        const a = announcements[0]
        s += '<div class="station">'
        s += `<a href='javascript:getStation("${a.LocationSignature}")'>`
        s += stationName(a.LocationSignature)
        s += '</a>'
        s += '</div>'
    }

    s += '<table>'

    const now = Date.now()

    foreach(announcements, a => {
        s += `${formatLatestAnnouncement(a, now, stationNames)}`
    })

    s += '</table>'
    s += '</div>'
    return s

    function stationName(locationSignature) {
        return stationNames ? stationNames[locationSignature] : locationSignature
    }
}

module.exports = getHtml
