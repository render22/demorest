var globals=[];
module.exports={
    set: function(key,val){
        globals[key]=val;
    },

    get: function(key){
        return globals[key]?globals[key]:null;
    }
}
