/*
 *
 * Work in progress
 *
*/

module.exports = {

    name: 'Project 01',

    base_dir: __dirname,

    params: {},

    routes: {},

    components: {
        users: {
            model: 'user',
            groups: {
                all: 'user, guest'
            },

            rights: {
                create: 'user',
                view: 'all'
            }
        }
    }

};