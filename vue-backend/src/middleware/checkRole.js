// src/middleware/checkRole.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Verificar se o usuário está autenticado
      if (!req.user || !req.user.roles) {
        return res.status(403).json({ 
          error: 'Usuário não autenticado ou sem permissões definidas' 
        });
      }

      // Normalizar roles permitidas (sempre array)
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      // Verificar se a role do usuário está nas roles permitidas
      const userRole = req.user.roles.toLowerCase();
      const hasPermission = rolesArray.some(role => 
        userRole === role.toLowerCase()
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          error: 'Acesso negado',
          message: 'Você não tem permissão para acessar este recurso',
          userRole: req.user.roles,
          requiredRoles: rolesArray
        });
      }

      console.log(`✅ Acesso permitido para usuário ${req.user.name} com role: ${req.user.roles}`);
      next();
    } catch (error) {
      console.error('Erro no middleware de verificação de role:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  };
};

export default checkRole;