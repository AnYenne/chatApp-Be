class AuthController {
    login(req, res){
        res.send('data login page')
    };
    logout(req, res){
        res.send('data logout')
    }
    

}
module.exports = new AuthController;