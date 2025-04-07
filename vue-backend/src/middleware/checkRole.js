//middleware/checkRole.js
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    // console.log('User Role:', req.user.role);
    // console.log('Required Role:', requiredRole);

    // Verifica se a role do usuário corresponde à role necessária
    if (!req.user || req.user.role.toLowerCase() !== requiredRole.toLowerCase()) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    next();
  };
};

export default checkRole;
