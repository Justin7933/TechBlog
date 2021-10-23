const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
//Bcrypt for password hashing
const bcrypt = require('bcrypt');

class User extends Model {
  checkPassword(loginPW) {
    return bcrypt.compareSync(loginPW, this.password);
  }
}

User.init(
  {
    //define ID column
    id: {
      // use Sequelize DataTypes object to provide type of data
      type: DataTypes.INTEGER,

      // equivalent of "NOT NULL" in  SQL
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    //define Username column
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    //define password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      // password must be at least five characters long
      validate: {
        len: [5],
      },
    },
  },
  {
    //beforeCreate lifecycle "hook" functionality
    // Add hooks for the password hashing operation
    hooks: {
      beforeCreate: async (newUserData) => {
        // Sets up a beforeCreate lifecycle hook to hash the password before the object is created in the database
        // & return the new userdata object
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },

      // beforeUpdate lifecycle "hook" functionality
      // set up a beforeUpdate lifecycle hook to hash the password before a user object is updated in the database
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
        return updatedUserData;
      },
    },

    //imported sequelize connection (the direct connection to database)
    sequelize,
    timestamps: false,
    // do not pluralize name of database table
    freezeTableName: true,
    underscored: true,
    modelName: 'user',
  }
);

module.exports = User;
