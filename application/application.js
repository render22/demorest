var mongoose = require('mongoose');
var dbConfig = require(globVars.get('configPath') + '/db.json');
var url = require('url');
var fs= require('fs');

/**
 * Main app initialization
 * @param app
 * @returns {Init}
 * @constructor
 */
function Init(app) {
    this.app = app;


    mongoose.connect(dbConfig.mongo.dbConnect);

    app.use(require('body-parser')());


    initRoutes(app);

    app.use(function (req, res, next) {

        res.status(404);

        res.send('404');

    });

// 500 error handler (middleware)

    app.use(function (err, req, res, next) {

        console.error(err.stack);

        res.status(500);

        res.send('500');

    });

    return this;

}

/**
 *
 * @param app
 */
function initRoutes(app) {


    var routes = require(globVars.get('configPath') + '/routes.json');
    var invokable;

    //set default route
   if(fs.existsSync(globVars.get('appPath') + '/controllers/index.js')){
       var indexController = require(globVars.get('appPath') + '/controllers/index.js');

       if (invokable=isControllerInvokable(indexController)) {
           if(invokable['indexAction']){
               app.get('/',invokable['indexAction'].bind(invokable));
           }
       }
   }

    for (var requestType in routes) {

        if (~globVars.get('mainConfig').supportedRequests.indexOf(requestType)) {

            for (var controller in routes[requestType]) {

                var contr = require(globVars.get('appPath') + '/controllers/' + controller + '.js');



                if (invokable=isControllerInvokable(contr)) {


                    var actions = routes[requestType][controller];

                    for (var action in actions) {


                        if (invokable[actions[action] + 'Action']) {
                            var actionName = actions[action] + 'Action';
                            app[requestType]('/' + controller + '/' + actions[action], invokable[actionName].bind(invokable));

                        } else {

                            app[requestType]('/' + controller + actions[action], function (req, resp, next) {
                                var reqUrl = url.parse(req.path);
                                var reqParts = reqUrl.path.split('/');

                                
                                if (reqParts[2]) {

                                    var actionName = reqParts[2] + 'Action';
                                    actionName = actionName.replace('/', '');

                                    if (invokable[actionName] instanceof Function)

                                        invokable[actionName].apply(invokable, arguments);

                                } else if (invokable['indexAction'] instanceof Function) {

                                         invokable['indexAction'].apply(invokable, arguments);

                                } else {

                                    next();
                                }


                            });
                        }


                    }

                }

            }


        }

    }
}



function isControllerInvokable(controller){
    if (controller instanceof Function) {

        var invokable = controller();

        if (typeof invokable !== 'object')
            return false;

        return invokable;
    }else{
        return false;
    }
 }




module.exports = Init;
