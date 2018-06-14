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
        },
        len: {
          args: [2,40],
          msg: "Your Title is to long or short"
        }
      }
    },
    author: {type: DataTypes.STRING, 
      validate: {
        notEmpty:{
          msg:'Looks like you forgot the author'
        },
        len: {
          args: [2,100],
          msg: "Your Author Name  is to long or short"
        }
      }},
    genre:{type: DataTypes.STRING,
      validate: {
        notEmpty:{
          msg: 'Genre is also required'
        },
        len: {
          args: [2,100],
          msg: "Your genre Name  is to long or short"
        }
      }},
    first_published: 
    {
      type: DataTypes.INTEGER,
      validate:{
         notEmpty:{
          msg:'Looks like you forgot the author'
        },
        len: {
          args: [1,6],
          msg: "The Year is probably wrong"
        }
      }
    }



  }, {timestamps: false});
  Books.associate = function(models) {
    // associations can be defined here
   Books.hasMany(models.Loans, {foreignKey: 'book_id'})
  };
  return Books;
};