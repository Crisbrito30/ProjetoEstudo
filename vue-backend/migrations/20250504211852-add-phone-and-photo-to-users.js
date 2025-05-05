export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('users', 'phone', {
    type: Sequelize.STRING,
    allowNull: true, // Permite valores nulos inicialmente
  });
  await queryInterface.addColumn('users', 'photo', {
    type: Sequelize.STRING,
    allowNull: true, // Permite valores nulos inicialmente
  });
}
