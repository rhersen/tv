require('./style.css')

const getHtml = require('./getHtml')

const r1 = new XMLHttpRequest()
const r2 = new XMLHttpRequest()

r1.open('GET', '/json/stations', true)
r2.open('GET', '/json/current', true)

let stations

r1.onload = function () {
    if (this.status >= 200 && this.status < 400) {
        const trainStations = JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation
        stations = {}
        trainStations.forEach(entry => stations[entry.LocationSignature] = entry.AdvertisedShortLocationName)
        r2.send()
    }
}
r2.onload = function () {
    if (this.status >= 200 && this.status < 400)
        document.getElementById('root')
            .insertAdjacentHTML('beforeend',
                getHtml(JSON.parse(this.response).RESPONSE.RESULT[0].TrainAnnouncement, stations))
}

r1.send()
