const differenceInSeconds = require('date-fns/difference_in_seconds')
const map = require('lodash.map')

function formatLatestAnnouncement(a, now, stationNames) {
    if (!a)
        return 'Aktuell information saknas'

    return `<tr>
<td>${difference()}</td>
<td>${a.AdvertisedTimeAtLocation.substring(11, 16)}</td>
<td>${to()}</td>
<td>${time()}</td>
<td class='train'><a href="${href()}">${a.AdvertisedTrainIdent}</a></td>
</tr>`

    function href() {
        return `javascript:getTrain(${a.AdvertisedTrainIdent})`
    }

    function difference() {
        const t = a.EstimatedTimeAtLocation || a.AdvertisedTimeAtLocation
        const diff = differenceInSeconds(t, now)

        if (diff <= -100)
            return ''

        if (diff < 0)
            return diff

        const seconds = diff % 60
        const minutes = (diff - seconds) / 60

        if (minutes < 10)
            return `${minutes}:${pad(seconds)}`

        return `${minutes}m`
    }

    function pad(seconds) {
        return (seconds < 10 ? '0' : '') + seconds
    }

    function to() {
        return map(map(a.ToLocation, 'LocationName'), stationName)
    }

    function time() {
        if (a.TimeAtLocation)
            return `<b>${a.TimeAtLocation.substring(11, 16)}</b>`

        if (a.EstimatedTimeAtLocation)
            return `<i>${a.EstimatedTimeAtLocation.substring(11, 16)}</i>`

        return ''
    }

    function stationName(locationSignature) {
        return stationNames ? stationNames[locationSignature] : locationSignature
    }
}

module.exports = formatLatestAnnouncement
