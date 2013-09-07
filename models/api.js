exports.loadModels = function ()
{

    var Schemas = {
        UserSchema: {
            id: {type: Number},
            name:{type: String},
            pass:{type: String}
        }
    };

    return Schemas;
};