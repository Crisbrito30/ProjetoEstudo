//controlles/userControllrs
import User from '../models/userModel.js'; 

//editar permissoes do usuário
export async function updateUserRole(req, res) {
  try {
    const { userId, newRole } = req.body;

    const validRoles = ['padrao', 'gestor', 'administrador'];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: 'Permissão inválida' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log('Antes da atualização:', user.roles); // Adiciona log antes da atualização

    user.roles = newRole; // Atualiza o papel do usuário
    await user.save(); // Salva no banco

    console.log('Depois da atualização:', user.roles); // Adiciona log depois da atualização

    return res.json({ message: 'Permissão atualizada com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao atualizar permissão' });
  }
}

