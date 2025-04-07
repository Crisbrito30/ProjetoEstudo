// src/seeds/fakeUsers.js
import { faker } from '@faker-js/faker';
import User from './src/models/userModel.js';
import sequelize from './src/config/db.js';
import bcrypt from 'bcrypt';

const NUM_USERS = 50;

async function generateFakeUsers() {
  try {
    await sequelize.sync(); // Garante que as tabelas existam

    const users = [];

    for (let i = 0; i < NUM_USERS; i++) {

        const plainPassword = faker.internet.password() //senha origial para ver no terninal
        const hashedPassword  = await  bcrypt.hash(plainPassword,10) //has de senha 
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        roles: faker.helpers.arrayElement(['padrao', 'gestor', 'administrador']),
      });
    console.log(`usuario:${users[i].email} | senha:${plainPassword}`)
    }

    await User.bulkCreate(users);

    console.log(`${NUM_USERS} usuários fake criados com sucesso.`);
    process.exit(0); // Finaliza o script
  } catch (error) {
    console.error('Erro ao criar usuários fake:', error);
    process.exit(1);
  }
}

generateFakeUsers();
