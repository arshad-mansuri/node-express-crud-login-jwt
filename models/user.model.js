module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      name: {
          type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      }
    });
    return User;
  };