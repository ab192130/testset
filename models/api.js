exports.loadModels = function ()
{

    var dbHashes = {
        UserHash: {
            name:{type: String},
            pass:{type: String}
        }
    };

    return dbHashes;
};

exports.getUser = function(model, name, callback){
    model.find({name: name}, function(err, data){
        callback(err, data);
    });
};