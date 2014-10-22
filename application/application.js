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

    setEnvSettings();
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
               app.get('/',invokable['indexAction'].bind(indexController));
           }
       }
   }

    for (var requestType in routes) {
        //Here is we check for supported request types from global config
        if (~globVars.get('mainConfig').supportedRequests.indexOf(requestType)) {

            for (var controller in routes[requestType]) {
                //Get controller full path
                var contr = require(globVars.get('appPath') + '/controllers/' + controller + '.js');

                //check prototype of module, if is function we accept it

                if (invokable=isControllerInvokable(contr)) {


                    var actions = routes[requestType][controller];

                    for (var action in actions) {

                        /* make sure that we dealing with action name */
                        /* if we specify in route config action name eg eg [actionname]Action we pass throw first condition
                         * */


                        if (invokable[actions[action] + 'Action']) {
                            var actionName = actions[action] + 'Action';
                            app[requestType]('/' + controller + '/' + actions[action], invokable[actionName].bind(controller));

                        } else {

                            app[requestType]('/' + controller + actions[action], function (req, resp, next) {
                                var reqUrl = url.parse(req.path);
                                var reqParts = reqUrl.path.split('/');

                                
                                if (reqParts[2]) {

                                    var actionName = reqParts[2] + 'Action';
                                    actionName = actionName.replace('/', '');

                                    if (invokable[actionName] instanceof Function)

                                        invokable[actionName].apply(controller, arguments);

                                } else if (invokable['indexAction'] instanceof Function) {

                                         invokable['indexAction'].apply(controller, arguments);

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
        //get object of controller which returned from constructor
        var invokable = controller();

        if (typeof invokable !== 'object')
            return false;

        return invokable;
    }else{
        return false;
    }
 }

function setEnvSettings() {

    switch (app.get('env')) {

        case 'development':


            break;

        case 'production':


            break;

        default:

            throw new Error('Unknown execution environment: ' + app.get('env'));

    }
}


module.exports = Init;
