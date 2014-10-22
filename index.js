var express = require('express');
globVars = require('./library/globals.js');

var appPath = __dirname + '/application';
var configPath = appPath + '/config';
var libPath = __dirname + '/library';

/* setting global variables which stored in globVars object*/
globVars.set('mainConfig',require('./config/config.json'));
globVars.set('configPath', configPath);
globVars.set('appPath', appPath);
globVars.set('libPath', libPath);


var application = require(appPath + '/application.js');
var engine = express();



try{
    application(engine);
}catch(e){
    console.log(e);
}



engine.set('port', process.env.PORT || 3000);


engine.listen(engine.get('port'), function () {
    console.log('Server started at '+engine.get('port'));
});

