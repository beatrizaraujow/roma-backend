// Middleware simples de autenticação
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const jwt = require('jsonwebtoken');
    const SECRET = process.env.JWT_SECRET || 'roma-secret-key-2025';
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
  }
};

export default { verificarToken };
