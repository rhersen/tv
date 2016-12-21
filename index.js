const moment = require('moment')

require('./style.css')
const getHtml = require('./getHtml')

const location = {
    c: ['Äs', 'Åbe', 'Sst', 'Cst', 'Ke'],
    n: ['So', 'Udl', 'Hel', 'Sol', 'Hgv', 'Nvk', 'R', 'Upv', 'Arnc'],
    s: ['Rön', 'Tu', 'Tul', 'Flb', 'Hu', 'Sta'],
    e: ['Hnd', 'Skg', 'Tåd', 'Fas'],
    w: ['Sub', 'Spå', 'Bkb', 'Jkb']
}

let stations

const root = document.getElementById('root')
root.insertAdjacentHTML('afterbegin', '<button id="update">Hämta data</button>')
root.insertAdjacentHTML('beforeend', '<div id="sheet"/>')

const button = root.firstElementChild
button.onclick = getCurrent

getStations()

function getCurrent() {
    const xhr = new XMLHttpRequest()
    xhr.onload = handleCurrent
    xhr.open('GET', '/json/current', true)
    xhr.send()
}

function getStations() {
    const xhr = new XMLHttpRequest()
    xhr.onload = handleStations
    xhr.open('GET', '/json/stations', true)
    xhr.send()
}

function handleStations() {
    if (this.status >= 200 && this.status < 400) {
        const trainStations = JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation
        stations = {}
        trainStations.forEach(entry => stations[entry.LocationSignature] = entry.AdvertisedShortLocationName)
    } else {
        document.getElementById('update').textContent = this.status
        document.getElementById('sheet').innerHTML = this.status
    }
}

function handleCurrent() {
    if (this.status >= 200 && this.status < 400) {
        const result = JSON.parse(this.response).RESPONSE.RESULT[0]
        document.getElementById('sheet').outerHTML = getHtml(result.TrainAnnouncement, stations)
        document.getElementById('update').textContent =
            moment(result.INFO.LASTMODIFIED['@datetime']).format('H:mm:ss')
    } else {
        document.getElementById('update').textContent = this.status
        document.getElementById('sheet').innerHTML = this.status
    }
}
