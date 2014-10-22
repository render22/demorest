var memoDb = require(globVars.get('appPath') + '/models/odm/memo.js');
var sanitizer = require('sanitizer');
var q = require('q');
/**
 *
 * @returns {{addRecord: Function, getAllRecords: Function}}
 * @constructor
 */
function Memo() {

    return {
        addRecord: function (data) {
            var inputData = data;

            filterData(inputData);

            if (inputData['title'] && inputData['description']) {
                var date = new Date();
                var record = new memoDb({
                    title: inputData['title'],
                    description: inputData['description'],
                    active: true,
                    date: date.getTime()
                });
                record.save(
                    function err(error) {
                        throw new Error(error);
                    }
                );
            } else {

                throw new Error('Please check your input data');
            }


        },

        getAllRecords: function () {
            var defer = q.defer();
            memoDb.find(function (err, data) {
                defer.resolve(data);
            });

            return defer.promise;
        }
    }


}

function filterData(data) {

    if (typeof data === "object") {

        for (var i in data) {

            var item = data[i];

            if (typeof item === "object") {

                filterData(item);
            } else {

                data[i] = sanitizer.sanitize(item);

            }
        }
    } else {
        return sanitizer.sanitize(data);
    }

}


module.exports = Memo;
