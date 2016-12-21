const expect = require('chai').expect

const getHtml = require('../getHtml')

describe('getHtml', function () {
    it('returns empty div', function () {
        const actual = getHtml()

        expect(actual).to.equal('<div id="sheet"></div>')
    })
})
