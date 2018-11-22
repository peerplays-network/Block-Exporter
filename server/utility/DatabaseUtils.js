const mysql = require('mysql');
const db = require('../database/constants');

const DatabaseUtils = {
	/**
   *
   * Connect to the database
   */
	connect: () => {
		const connection = mysql.createConnection({
			host: db.HOST,
			user: db.USER,
			password: db.PASSWORD,
			database: db.DATABASE
		});
        
		connection.connect((err) => {
			if (err) {
				console.error('error connecting to DB: ' + err.stack);
				return;
			}
		});
        
		return connection;
	},


};

module.exports = DatabaseUtils;