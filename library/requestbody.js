var q=require('q');
var qs=require('querystring');
function GetBody(req){
    var body='';
    var defer= q.defer();
    req.on('data',function(data){
       body+=data.toString();
    });

    req.on('end',function(){

         defer.resolve(qs.parse(body));
    });

    return defer.promise;
}

module.exports=GetBody;
