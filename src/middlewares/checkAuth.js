import verifyJWTToken from "../utils/verifyJWTToken";

export const checkAuth = (req, res, next) => {
    if(req.path === '/user/login' || req.path === '/user/registration'){
        return next();
    }

    if(req.method === "OPTIONS") return next();

    let token = req.headers.token;

    verifyJWTToken(token).then(user => {
        req.user = user;
        next();
    }).catch(() => {
        res.status(403).json({message: "Invalid token provided"})
    })
}