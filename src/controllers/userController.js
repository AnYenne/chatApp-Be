class UserController {
    getData(req, res){
        res.send('data 1 user')
    };
    getDataAll(req, res){
        res.send('data all user')
    }
    

}
module.exports = new UserController;