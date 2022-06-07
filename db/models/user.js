'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Users.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  Users.addHook('beforeCreate', async function (user) {
    const salt = await bcrypt.genSalt(10);
    console.log(user);
    user.password = await bcrypt.hash(user.password, salt);
  });
  Users.prototype.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      return done(err, isMatch);
  });
  Users.associate = function (models) {
      Users.hasMany(models.Events);
  };
}
  return Users;
};