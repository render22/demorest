var mongoose=require('mongoose');

var memoSchema= mongoose.Schema({
    title: String,
    description : String,
    active: Boolean,
    date: Number

});


memoSchema.methods.displayDate=function(){
    var date=new Date(this.date);
    return date.getDay() +':'+(date.getMonth()+1)+':'+date.getFullYear();
}

var Memo=mongoose.model('memoSchema',memoSchema);
module.exports=Memo;