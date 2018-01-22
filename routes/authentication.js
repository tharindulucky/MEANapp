const AuthenticationController = require('../controllers/AuthenticationController');

module.exports = (router) => {

    router.get('/checkEmail/:email', AuthenticationController.checkEmail);
    router.get('/checkUsername/:username', AuthenticationController.checkUsername);

    router.post('/register', AuthenticationController.registerUser);
    router.post('/login', AuthenticationController.loginUser);
    router.use(AuthenticationController.checkAuth);
    router.get('/profile', AuthenticationController.getProfile);

    return router;
}