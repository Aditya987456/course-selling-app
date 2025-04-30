import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_USER;

function UserMiddleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({
            message: 'Token not provided. Please login.'
        });
    }

    try {
        const decodedResult = jwt.verify(token, JWT_SECRET);
        req.userID = decodedResult.id;
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token. Please login again.'
        });
    }
}

export default UserMiddleware;
