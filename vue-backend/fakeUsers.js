// fakeUsers.js - Versão com geração de avatares SVG
import { faker } from '@faker-js/faker';
import User from './src/models/userModel.js';
import sequelize from './src/config/db.js';
import bcrypt from 'bcrypt';
import { generateFakeImage } from './generateFakeImage.js';

const NUM_USERS = 50;

async function generateFakeUsers() {
  try {
    console.log('🔄 Conectando ao banco de dados...');
    await sequelize.sync();
    console.log('📌 Banco de dados sincronizado.');

    const users = [];

    console.log(`🚀 Gerando ${NUM_USERS} usuários fake com avatares SVG...`);

    for (let i = 0; i < NUM_USERS; i++) {
      const name = faker.person.fullName();
      const email = faker.internet.email().toLowerCase();
      const phone = faker.phone.number();
      const plainPassword = faker.internet.password({ length: 8 });
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Gera nome do arquivo único
      const fileName = `avatar-${Date.now()}-${i}.svg`;
      
      // Gera o avatar SVG
      const photoPath = await generateFakeImage(name, fileName);

      // Se não conseguiu gerar o avatar, usa um padrão
      const finalPhotoPath = photoPath || `/uploads/default-avatar.svg`;

      users.push({
        photo: finalPhotoPath,
        name,
        email,
        phone,
        password: hashedPassword,
        roles: faker.helpers.arrayElement(['padrao', 'gestor', 'administrador']),
      });

      console.log(`👤 ${i + 1}/${NUM_USERS} - ${name} (${email}) | Senha: ${plainPassword}`);
    }

    console.log('💾 Salvando usuários no banco...');
    await User.bulkCreate(users);
    console.log(`✅ ${NUM_USERS} usuários fake criados com sucesso!`);
    console.log(`📁 Avatares salvos em: uploads/fake/`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao criar usuários fake:', error);
    process.exit(1);
  }
}

generateFakeUsers();