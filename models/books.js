'use strict';
module.exports = (sequelize, DataTypes) => {
  var Books = sequelize.define('Books', {
    id: {type: DataTypes.INTEGER, 
      primaryKey:true, autoIncrement:true},
    title: {type: DataTypes.STRING, 
      unique: false,
      validate: {
        notEmpty:{
          msg: "Pay attention, you missed the title"
        }
      }
    },
    author: {type: DataTypes.STRING, 
      validate: {
        notEmpty:{
          msg:'Looks like you forgot the author'
        }
      }},
    genre:{type: DataTypes.STRING,
      validate: {
        notEmpty:{
          msg: 'Genre is also required'
        }
      }},
    first_published: DataTypes.INTEGER  
  }, {timestamps: false});
  Books.associate = function(models) {
    // associations can be defined here
   Books.hasMany(models.Loans, {foreignKey: 'book_id'})
  };
  return Books;
};