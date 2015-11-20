//connecting mysql using sequelize
//Do not commit this file on github as all system will have different configuration 
var Sequelize = require('sequelize');

var sequelize = new Sequelize('uber_db', 'root', '', {
	host: '127.0.0.1',
	dialect: 'mysql', 
	port: '3307'
});

exports.sequelize = sequelize;