const moment = require('moment')

require('./style.css')
const htmlTable = require('./htmlTable')

const location = {
    c: ['Äs', 'Åbe', 'Sst', 'Cst', 'Ke'],
    n: ['So', 'Udl', 'Hel', 'Sol', 'Hgv', 'Nvk', 'R', 'Upv', 'Arnc'],
    s: ['Rön', 'Tu', 'Tul', 'Flb', 'Hu', 'Sta'],
    e: ['Hnd', 'Skg', 'Tåd', 'Fas'],
    w: ['Sub', 'Spå', 'Bkb', 'Jkb']
}

let stations

const root = document.getElementById('root')
root.insertAdjacentHTML('afterbegin', '<button id="update">result.INFO</button>')
root.insertAdjacentHTML('beforeend', getIndex())
root.insertAdjacentHTML('beforeend', '<div id="sheet">the sheet</div>')

function getIndex() {
    let s = '<div id="index">'
    s += '<span><a href="javascript:getTrains(\'w\',\'n\')">Järfälla norrut</a></span>'
    s += '<span><a href="javascript:getTrains(\'w\',\'s\')">Järfälla söderut</a></span>'
    s += '<span><a href="javascript:getTrains(\'n\',\'n\')">Solna norrut</a></span>'
    s += '<span><a href="javascript:getTrains(\'n\',\'s\')">Solna söderut</a></span>'
    s += '<span><a href="javascript:getTrains(\'c\',\'n\')">Centralen norrut</a></span>'
    s += '<span><a href="javascript:getTrains(\'c\',\'s\')">Centralen söderut</a></span>'
    s += '<span><a href="javascript:getTrains(\'s\',\'n\')">Huddinge norrut</a></span>'
    s += '<span><a href="javascript:getTrains(\'s\',\'s\')">Huddinge söderut</a></span>'
    s += '<span><a href="javascript:getTrains(\'e\',\'n\')">Haninge norrut</a></span>'
    s += '<span><a href="javascript:getTrains(\'e\',\'s\')">Haninge söderut</a></span>'
    s += '</div>'
    return s
}

const button = root.firstElementChild
button.onclick = getCurrent

getStations()

function getCurrent() {
    document.getElementById('sheet').innerHTML = ''
}

function getStations() {
    const xhr = new XMLHttpRequest()
    xhr.onload = handleStations
    xhr.open('GET', '/json/stations', true)
    xhr.send()
}

window.getTrains = (branch, direction) => {
    const xhr = new XMLHttpRequest()
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            const locations = direction === 'n' ? location[branch] : location[branch].slice().reverse()
            const result = JSON.parse(this.response).RESPONSE.RESULT[0]
            document.getElementById('sheet').outerHTML = htmlTable(result.TrainAnnouncement, locations)
            document.getElementById('update').textContent =
                moment(result.INFO.LASTMODIFIED['@datetime']).format('H:mm:ss')
        } else {
            document.getElementById('sheet').innerHTML = this.status
            document.getElementById('update').textContent = this.status
        }
    }

    xhr.open('GET', `/json/trains/${direction}?${location[branch]}`, true)
    xhr.send()
    document.getElementById('sheet').innerHTML = ''
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
