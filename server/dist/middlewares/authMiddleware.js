import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export function checkRoles(roles) {
    return function (req, res, next) {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized. No token provided!" });
        }
        try {
            const payload = jwt.verify(token, String(process.env.SECRET_KEY));
            if (!roles.includes(payload.role)) {
                return res.status(403).json({ error: "Forbidden access. User dosen't have the required role." });
            }
        }
        catch (error) {
            return res.status(403).json({ error: "Forbidden access. Invalid token." });
        }
        next();
    };
}
//# sourceMappingURL=authMiddleware.js.map