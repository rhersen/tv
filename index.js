require('./style.css')

const html = require('./html')

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
    if (this.status >= 200 && this.status < 400) {
        const result = JSON.parse(this.response).RESPONSE.RESULT[0]
        const root = document.getElementById('root')
        root.insertAdjacentHTML('afterbegin', html.lastModified(result.INFO))
        root.insertAdjacentHTML('beforeend', html.trains(result.TrainAnnouncement, stations))
    }
}

r1.send()
