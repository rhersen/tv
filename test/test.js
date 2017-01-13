const expect = require('chai').expect

const formatLatestAnnouncement = require('../formatLatestAnnouncement')
const formatAnnouncement = require('../formatAnnouncement')

describe('formatLatestAnnouncement', function () {
    it('returns empty div', function () {
        expect(formatLatestAnnouncement()).to.equal('Aktuell information saknas')
    })

    it('formats future train', function () {
        const a = {
            AdvertisedTrainIdent: '1234',
            AdvertisedTimeAtLocation: '2016-12-27T16:59:00'
        }

        expect(formatLatestAnnouncement(a, '2016-12-27T16:58:50')).to.equal([
            '<tr>',
            '<td>0:10</td>',
            '<td>16:59</td>',
            '<td></td>',
            '<td></td>',
            '<td class=\'train\'><a href="javascript:getTrain(1234)">1234</a></td>',
            '</tr>'
        ].join('\n'))
    })

    it('formats passed train', function () {
        const a = {
            AdvertisedTrainIdent: '1234',
            AdvertisedTimeAtLocation: '2016-12-27T16:59:00',
            TimeAtLocation: '2016-12-27T17:01:00'
        }

        expect(formatLatestAnnouncement(a, '2016-12-27T16:58:50')).to.equal([
            '<tr>',
            '<td>0:10</td>',
            '<td>16:59</td>',
            '<td></td>',
            '<td><b>17:01</b></td>',
            '<td class=\'train\'><a href="javascript:getTrain(1234)">1234</a></td>',
            '</tr>'
        ].join('\n'))
    })

    it('formats delayed train', function () {
        const a = {
            AdvertisedTrainIdent: '1234',
            AdvertisedTimeAtLocation: '2016-12-27T16:59:00',
            EstimatedTimeAtLocation: '2016-12-27T17:01:00'
        }

        expect(formatLatestAnnouncement(a, '2016-12-27T16:58:50')).to.equal([
            '<tr>',
            '<td>2:10</td>',
            '<td>16:59</td>',
            '<td></td>',
            '<td><i>17:01</i></td>',
            '<td class=\'train\'><a href="javascript:getTrain(1234)">1234</a></td>',
            '</tr>'
        ].join('\n'))
    })

    describe('diff', function () {
        function expected(diff) {
            return ['<tr>',
                diff,
                '<td>16:50</td>',
                '<td></td>',
                '<td></td>',
                '<td class=\'train\'><a href="javascript:getTrain(1234)">1234</a></td>',
                '</tr>']
        }

        const a = {
            AdvertisedTrainIdent: '1234',
            AdvertisedTimeAtLocation: '2016-12-27T16:50:00'
        }

        it('shows 2 digit minutes', function () {
            expect(formatLatestAnnouncement(a, '2016-12-27T16:38:00')).to.equal(expected('<td>12m</td>').join('\n'))
        })

        it('shows minutes:seconds', function () {
            expect(formatLatestAnnouncement(a, '2016-12-27T16:48:00')).to.equal(expected('<td>2:00</td>').join('\n'))
        })

        it('shows 2 digit negative', function () {
            expect(formatLatestAnnouncement(a, '2016-12-27T16:51:39')).to.equal(expected('<td>-99</td>').join('\n'))
        })

        it('does not show 3 digit negative', function () {
            expect(formatLatestAnnouncement(a, '2016-12-27T16:51:40')).to.equal(expected('<td></td>').join('\n'))
        })
    })
})

describe('formatAnnouncement', function () {
    it('returns empty div', function () {
        expect(formatAnnouncement()).to.equal('Aktuell information saknas')
    })

    it('formats future train', function () {
        const a = {
            AdvertisedTrainIdent: '1234',
            AdvertisedTimeAtLocation: '2016-12-27T16:59:00',
            LocationSignature: 'Fas'
        }

        expect(formatAnnouncement(a, '2016-12-27T16:58:50')).to.equal([
            '<tr>',
            '<td class="station"><a href="javascript:getStation(\'Fas\')">Fas</a></td>',
            '<td>0:10</td>',
            '<td>16:59</td>',
            '<td></td>',
            '</tr>'
        ].join('\n'))
    })
})
