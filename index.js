require('./style.css')

const html = require('./html')

let stations

const root = document.getElementById('root')
root.insertAdjacentHTML('afterbegin', '<button id="update">result.INFO</button>')
root.insertAdjacentHTML('beforeend', '<div id="trains">wait...</div>')

const button = root.firstElementChild
button.onclick = getCurrent

getStations()

function getCurrent() {
    const xhr = new XMLHttpRequest()
    xhr.onload = handleTrains
    xhr.open('GET', '/json/current', true)
    xhr.send()
}

function getStations() {
    const xhr = new XMLHttpRequest()
    xhr.onload = handleStations
    xhr.open('GET', '/json/stations', true)
    xhr.send()
}

function handleTrains() {
    if (this.status >= 200 && this.status < 400) {
        const result = JSON.parse(this.response).RESPONSE.RESULT[0]
        document.getElementById('update').textContent = html.lastModified(result.INFO)
        document.getElementById('trains').outerHTML = html.trains(result.TrainAnnouncement, stations)
    } else {
        document.getElementById('update').textContent = this.status
        document.getElementById('trains').innerHTML = this.status
    }
}

function handleStations() {
    if (this.status >= 200 && this.status < 400) {
        const trainStations = JSON.parse(this.response).RESPONSE.RESULT[0].TrainStation
        stations = {}
        trainStations.forEach(entry => stations[entry.LocationSignature] = entry.AdvertisedShortLocationName)
        getCurrent()
    } else {
        document.getElementById('update').textContent = this.status
        document.getElementById('trains').innerHTML = this.status
    }
}
