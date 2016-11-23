const moment = require('moment')

const foreach = require('lodash.foreach')
const groupby = require('lodash.groupby')
const map = require('lodash.map')
const maxby = require('lodash.maxby')

const position = require('./position')
const MatchingTrains = require('./MatchingTrains')

module.exports = {
    trains: as => {
        let s = '<div id="trains">'
        const sub = as.filter(a => a.LocationSignature === 'Sub').filter(a => a.ActivityType === 'Avgang')
        const tul = as.filter(a => a.LocationSignature === 'Tul').filter(a => a.ActivityType === 'Ankomst')
        const southbounds = sub.filter(southbound)
            .map(avgang =>
                selectAnkomst(tul.filter(southbound).filter(ankomst => minutes(ankomst, avgang) > 29), avgang))

        s += '<table>'
        s += '<caption>Från Tullinge</caption>'

        MatchingTrains.getNorthbound(as)
            .forEach(selected => selected && writeRow(selected.ankomst, selected.avgang))

        s += '</table>'

        s += '<table>'
        s += '<caption>Från Sundbyberg</caption>'
        southbounds.forEach(selected => selected && writeRow(selected.ankomst, selected.avgang))
        s += '</table>'
        s += '</div>'

        return s

        function southbound(ankomst) {
            return /[13579]$/.test(ankomst.AdvertisedTrainIdent)
        }

        function selectAnkomst(ankomsts, avgang) {
            if (ankomsts.length) {
                const selected = ankomsts.reduce((prev, cur) => {
                    const diff1 = minutes(prev, avgang)
                    const diff2 = minutes(cur, avgang)
                    return diff2 < diff1 ? cur : prev
                })

                return {ankomst: selected, avgang: avgang}
            }
        }

        function minutes(ankomst, avgang) {
            const ank = ankomst.AdvertisedTimeAtLocation
            const avg = avgang.AdvertisedTimeAtLocation
            const ankm = moment(ank)
            const avgm = moment(avg)
            return ankm.diff(avgm, 'minutes')
        }

        function writeRow(ankomst, avgang) {
            const departureTime = avgang.AdvertisedTimeAtLocation.substring(11, 16)
            const trainIdent = ankomst.AdvertisedTrainIdent
            const minuteDiff = minutes(ankomst, avgang) - 32
            s += '<tr>'
            s += `<td>${departureTime}`
            s += `<td><a href="javascript:getTrain(${trainIdent})">${trainIdent}</a>`
            s += `<td>${minuteDiff} min`
        }
    },

    lastModified: info =>
        moment(info.LASTMODIFIED['@datetime']).format('H:mm:ss')
}
