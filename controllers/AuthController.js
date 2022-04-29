const db = require("../models/db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = db.user;

//register a user
exports.register = async (req, res) => {
    // Validate request
    if (!req.body.name || req.body.name.length < 3 || req.body.name.length > 20) {
      res.status(400).send({
        message: "Please enter a name of between 3 to 20 characters long"
      });
      return;
    }
    if (!req.body.username || req.body.username.length < 6 || req.body.username.length > 8) {
        res.status(400).send({
          message: "Please enter a username of between 6 to 8 characters long"
        });
        return;
    }
    if (!req.body.password || req.body.password.length < 6 || req.body.password.length > 8) {
        res.status(400).send({
          message: "Please enter a password of between 6 to 8 characters long"
        });
        return;
    }
    //checking if username already taken
    const username = req.body.username;
    User.findOne({
        where:{username:username}
    })
    .then(data => {
      if (data) {
        res.status(400).send({
          message: "Username already taken, please try with different username"
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Some error occurred while creating the User."
      });
    });

    //creating new user
    const user = {
      name: req.body.name,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
    };
    User.create(user)
      .then(data => {
        res.status(201).send({
          message: `${data.name} your account created sucessfully`
        });
      })
      .catch(err => {
        res.status(500).send({
          message: "Some error occurred while creating the User."
        });
      });
};

//authenticate a user
exports.login = (req, res) => {
    try{
        if (!req.body.username) {
            res.status(400).send({
              message: "Please enter a username"
            });
            return;
        }
        if (!req.body.password) {
            res.status(400).send({
              message: "Please enter a password"
            });
            return;
        }
        const username = req.body.username;
        const password = req.body.password;
        User.findOne({
            where:{username:username}
        })
        .then(data => {
            if (data) {
                bcrypt.compare(password, data.password, function(err, result) {
                    if(result){
                        const token = jwt.sign(
                          { user_id: data.id, username:data.username },
                          process.env.JWT_TOKEN_KEY,
                          {
                            expiresIn: "1h",
                          }
                        );
                        const userDetails = {message:"User authenticated successfully",username:data.username,token:token};
                        res.status(200).send(userDetails);
                    }
                    else{
                        res.status(400).send({
                            message: "Invalid credentials"
                        });
                    }
                });
            } else {
                res.status(404).send({
                message: "Cannot find user"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with username=" + username
            });
        });
    }
    catch(e){
        console.log(e);
    }
};