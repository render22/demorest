/* Here is we take advantage with convenience naming eg [actionname]Action for better controlling purposes */

var memo = require(globVars.get('appPath') + '/models/memo.js');
var GetBody = require(globVars.get('libPath') + '/requestbody.js');

module.exports = function () {

    return {
        indexAction: function (req, resp) {

        },

        creatememoAction: function (req, resp) {

            //  var res=memo().addRecord(req.body);
            GetBody(req).then(function (data) {
                memo().addRecord(data);
                resp.json({status: 'ok'});
            }).catch(function (e) {
                resp.status(500);

                resp.json({error: e.message});
            });


        },

        getmemoAction: function (req, resp) {

            memo().getAllRecords().then(function (data) {
                resp.json(data);
            });

        }
    }
}
