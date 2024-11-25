const jwt = require('jsonwebtoken')


// SECRET 
const JWT_SECRET = "TaskManager2024"

const veryfyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'Token não fornecido.' });
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Token invalido' });
        req.uer = decoded;
        next()
    })
}

module.exports = veryfyToken;