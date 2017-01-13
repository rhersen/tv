require('./style.css')
const getHtml = require('./getHtml')
const getTrainHtml = require('./getTrainHtml')

let stations

const root = document.getElementById('root')
root.insertAdjacentHTML('afterbegin', '<button id="update">Hämta data</button>')
root.insertAdjacentHTML('beforeend', '<div id="sheet"/>')

const button = root.firstElementChild
button.onclick = getCurrent

getStations()

window.getStation = (id) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = handleCurrent
    xhr.open('GET', '/json/departures?locations=' + id + '&since=0:10&until=0:50', true)
    xhr.send()
    document.getElementById('sheet').innerHTML = ''
}

function getCurrent() {
    window.getStation('Sst')
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
        document.getElementById('update').textContent = result.INFO.LASTMODIFIED['@datetime']
    } else {
        document.getElementById('update').textContent = this.status
        document.getElementById('sheet').innerHTML = this.status
    }
}

window.getTrain = (id) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            const result = JSON.parse(this.response).RESPONSE.RESULT[0]
            document.getElementById('sheet').outerHTML = getTrainHtml(result.TrainAnnouncement, stations)
            document.getElementById('update').textContent = result.INFO.LASTMODIFIED['@datetime']
        } else {
            document.getElementById('sheet').innerHTML = this.status
            document.getElementById('update').textContent = this.status
        }
    }

    xhr.open('GET', `/json/train/${id}`, true)
    xhr.send()
    document.getElementById('sheet').innerHTML = ''
}
