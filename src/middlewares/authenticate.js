import jwt from "jsonwebtoken";

export default (req, res, next) => {
    if (process.env.JWT_SECRET == "test") {
        req.newToken = "test";
        return next();
    }
    const { token, email: userEmail } = req.cookies;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    if (email != userEmail)
        throw new Error("INVALID_INFO");
    req.newToken = this.generateToken(email);
    next();
};