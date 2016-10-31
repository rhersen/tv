const moment = require('moment')

const foreach = require('lodash.foreach')
const groupby = require('lodash.groupby')
const map = require('lodash.map')
const maxby = require('lodash.maxby')

const formatLatestAnnouncement = require('./formatLatestAnnouncement')
const position = require('./position')

function getHtml(announcements, stationNames) {
    let s = ''

    const latest = map(groupby(announcements, 'AdvertisedTrainIdent'), v => maxby(v, 'TimeAtLocation'))

    foreach(groupby(latest, direction), (trains, dir) => {
        s += `<h1>${dir}</h1>`

        trains.sort((t1, t2) => {
            const p1 = position.y(t1.LocationSignature)
            const p2 = position.y(t2.LocationSignature)

            if (p1 !== p2)
                return p1 - p2

            const diff = moment(t1.TimeAtLocation).diff(moment(t2.TimeAtLocation), 'minutes')
            return isSouthbound(t1) ? -diff : diff
        })

        foreach(trains, a => {
            s += `<div class="${position.x(a.LocationSignature)}`
            s += ` ${delay(a)}">${formatLatestAnnouncement(a, stationNames)}</div>`
        })
    })
    return s
}

function delay(a) {
    const minutes = moment(a.TimeAtLocation).diff(moment(a.AdvertisedTimeAtLocation), 'minutes')
    if (minutes < 1) return 'delay0'
    if (minutes < 2) return 'delay1'
    if (minutes < 4) return 'delay2'
    if (minutes < 8) return 'delay4'
    return 'delay8'
}

function direction(t) {
    return isSouthbound(t) ? 'söderut' : 'norrut'
}

function isSouthbound(t) {
    return /[13579]$/.test(t.AdvertisedTrainIdent)
}

module.exports = getHtml
