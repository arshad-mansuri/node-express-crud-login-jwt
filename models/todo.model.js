module.exports = (sequelize, Sequelize) => {
    const Todo = sequelize.define("todo", {
      task: {
        type: Sequelize.TEXT
      },
      user_id: {
        type: Sequelize.INTEGER
      }
    });
    return Todo;
  };