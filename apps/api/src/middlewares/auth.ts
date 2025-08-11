import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'dev-secret';
        const payload = jwt.verify(token, secret);
        (req as any).user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};