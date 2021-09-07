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


module.exports = { isAuth };