const db = require("../models/db");
const Todo = db.todo;

// Create and Save a new Task
exports.create = (req, res) => {
    // Validate request
    if (!req.body.task) {
      res.status(400).send({
        message: "Task can not be empty!"
      });
      return;
    }
    const todo = {
      task: req.body.task,
      user_id : req.user.user_id
    };

    // Save Task in the database
    Todo.create(todo)
      .then(data => {
        res.status(201).send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Some error occurred while creating the Task."
        });
      });
  };

// Retrieve all Tasks from the database.
exports.findAll = (req, res) => {
    Todo.findAll({
      where:{user_id:req.user.user_id}
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Some error occurred while retrieving tasks."
        });
      });
  };

// Update a Task by the id in the request
exports.update = (req, res) => {
    const id = req.body.id;
    Todo.update({'task':req.body.task}, {
      where: {id:id,user_id:req.user.user_id}
    })
      .then(num => {
        if (num == 1) {
          res.status(200).send({
            message: "Task was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Task with id=${id}`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Task with id=" + id
        });
      });
  };

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
    const id = req.body.id;
    Todo.destroy({
      where: {id:id,user_id:req.user.user_id}
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Task was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Task with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Task with id=" + id
        });
      });
  };

// Delete all Task from the database.
exports.deleteAll = (req, res) => {
    Todo.destroy({
      where: {user_id:req.user.user_id},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Task were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all task."
        });
      });
  };