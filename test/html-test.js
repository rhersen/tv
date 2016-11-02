const expect = require('chai').expect

const html = require('../html')

describe('html', function () {
    describe('trains', function () {
        describe('texts', function () {
            it('returns empty string on empty input', function () {
                expect(html.trains()).to.be.empty
            })

            const announcements = [{
                'ActivityType': 'Ankomst',
                'AdvertisedTimeAtLocation': '2016-06-28T21:52:00',
                'AdvertisedTrainIdent': '2769',
                'LocationSignature': 'Åbe',
                'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
                'TimeAtLocation': '2016-06-28T21:57:00'
            }, {
                'ActivityType': 'Ankomst',
                'AdvertisedTimeAtLocation': '2016-06-28T22:19:00',
                'AdvertisedTrainIdent': '2870',
                'LocationSignature': 'Åbe',
                'ToLocation': [{'LocationName': 'Spå', 'Priority': 1, 'Order': 0}],
                'TimeAtLocation': '2016-06-28T22:20:00'
            }, {
                'ActivityType': 'Ankomst',
                'AdvertisedTimeAtLocation': '2016-06-28T22:10:00',
                'AdvertisedTrainIdent': '2868',
                'LocationSignature': 'Spå',
                'ToLocation': [{'LocationName': 'Spå', 'Priority': 1, 'Order': 0}],
                'TimeAtLocation': '2016-06-28T22:08:00'
            }, {
                'ActivityType': 'Ankomst',
                'AdvertisedTimeAtLocation': '2016-06-28T22:10:00',
                'AdvertisedTrainIdent': '2866',
                'LocationSignature': 'Spå',
                'ToLocation': [{'LocationName': 'Spå', 'Priority': 1, 'Order': 0}],
                'TimeAtLocation': '2016-06-28T22:09:00'
            }, {
                'ActivityType': 'Avgang',
                'AdvertisedTimeAtLocation': '2016-06-28T22:06:00',
                'AdvertisedTrainIdent': '2864',
                'LocationSignature': 'Sub',
                'ToLocation': [{'LocationName': 'Spå', 'Priority': 1, 'Order': 0}],
                'TimeAtLocation': '2016-06-28T22:06:00'
            }]

            it('arrival three minutes late', function () {
                expect(html.trains(announcements))
                    .to.match(/Tåg 2769 mot Söc ankom till Åbe 5 minuter försenat klockan 21:57/)
            })

            it('departure one minute late', function () {
                expect(html.trains(announcements))
                    .to.match(/Tåg 2870 mot Spå ankom till Åbe nästan i tid klockan 22:20/)
            })

            it('early arrival', function () {
                expect(html.trains(announcements))
                    .to.match(/Tåg 2868 mot Spå ankom till Spå i god tid klockan 22:08/)
            })

            it('one minute is not really early arrival', function () {
                expect(html.trains(announcements))
                    .to.match(/Tåg 2866 mot Spå ankom till Spå i tid klockan 22:09/)
            })

            it('departure on time', function () {
                expect(html.trains(announcements))
                    .to.match(/Tåg 2864 mot Spå avgick från Sub i tid klockan 22:06/)
            })
        })

        describe('sorting', function () {
            it('northbound by actual time', function () {
                const announcements = [{
                    'ActivityType': 'Ankomst',
                    'AdvertisedTimeAtLocation': '2016-10-28T17:44:00',
                    'AdvertisedTrainIdent': '2752',
                    'LocationSignature': 'Cst',
                    'ToLocation': [{'LocationName': 'Mr', 'Priority': 1, 'Order': 0}],
                    'TimeAtLocation': '2016-10-28T17:44:00'
                }, {
                    'ActivityType': 'Ankomst',
                    'AdvertisedTimeAtLocation': '2016-10-28T17:48:00',
                    'AdvertisedTrainIdent': '2352',
                    'LocationSignature': 'Cst',
                    'ToLocation': [{'LocationName': 'Kän', 'Priority': 1, 'Order': 0}],
                    'TimeAtLocation': '2016-10-28T17:47:00'
                }]
                expect(stripTags(html.trains(announcements))).to.equal('norrut' +
                    'Tåg 2752 mot Mr ankom till Cst i tid klockan 17:44' +
                    'Tåg 2352 mot Kän ankom till Cst i tid klockan 17:47')
            })

            it('southbound by actual time', function () {
                const announcements = [{
                    'ActivityType': 'Avgang',
                    'AdvertisedTimeAtLocation': '2016-10-31T07:52:00',
                    'AdvertisedTrainIdent': '2513',
                    'LocationSignature': 'Sst',
                    'ToLocation': [{'LocationName': 'Vhe', 'Priority': 1, 'Order': 0}],
                    'EstimatedTimeAtLocation': '2016-10-31T07:53:00',
                    'TimeAtLocation': '2016-10-31T07:54:00'
                }, {
                    'ActivityType': 'Ankomst',
                    'AdvertisedTimeAtLocation': '2016-10-31T07:56:00',
                    'AdvertisedTrainIdent': '2213',
                    'LocationSignature': 'Sst',
                    'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
                    'TimeAtLocation': '2016-10-31T07:56:00'
                }]
                expect(stripTags(html.trains(announcements))).to.equal('söderut' +
                    'Tåg 2213 mot Tu ankom till Sst i tid klockan 07:56' +
                    'Tåg 2513 mot Vhe avgick från Sst 2 minuter försenat klockan 07:54')
            })
        })
    })
    describe('lastModified', function () {
        it('formats with 24h', function () {
            expect(html.lastModified({
                'LASTMODIFIED': {
                    '@datetime': '2016-11-02T16:32:52.509Z'
                }
            })).to.equal('<div>17:32:52</div>')
        })
    })
})

function stripTags(s) {
    return s.replace(/<[^>]+>/g, '')
}
