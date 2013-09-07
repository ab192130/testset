exports.loadModels = function (mongoose)
{
    var Schema = mongoose.schema;

    var UserHash = {
        id: {type: Number},
        name:{type: String},
        pass:{type: String}
    };

    var schemas = {
       UserSchema: new Schema(UserHash)
    };

    var models = {
       UserModel: mongoose.model('Users', schemas.UserSchema)
    };

    return models;
};