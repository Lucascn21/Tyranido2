// sessionAuthMW
const isAuth = (req, res, next) => {
    if(req.session.isAuth){
        next();
    }else{
        res.status(401);
        req.session.context = "IncorrectSession";
        res.redirect('/');
    }
};

const isNotAuth = (req, res, next) => {
    if(req.session.isAuth){
        res.status(401);
        req.session.context = "AlreadyLoggedIn";
        res.redirect('/dashboard');
    }else{
        next();
    }
};


module.exports = { isAuth, isNotAuth };