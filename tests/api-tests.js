var assert = require('chai').assert;
var rest = require('restler');
var unitConfig = require('../config/unittesting.json');


suite('Api methods test', function () {

    if (unitConfig.api) {
        for (var testName in unitConfig.api) {
            test(testName, function (done) {

                rest[unitConfig.api[testName]['requestType']](unitConfig.api[testName]['url'])
                    .on('success', function (data) {

                        assert(eval(unitConfig.api[testName]['condition']));
                        done();
                    })
            });
        }
    }


});
