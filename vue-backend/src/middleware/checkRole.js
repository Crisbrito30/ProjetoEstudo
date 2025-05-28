// middleware/checkRole.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {

    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: 'Usuário não autenticado' });
    }

    // Converte para array se for string (mantém compatibilidade)
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Verifica se a role do usuário está na lista de roles permitidas
    const hasPermission = rolesArray.some(role => 
      req.user.roles.toLowerCase() === role.toLowerCase()
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'Acesso negado',
        userRole: req.user.roles,
        requiredRoles: rolesArray
      });
    }

    console.log('✅ Acesso permitido para:', req.user.roles);
    next();
  };
};

export default checkRole;