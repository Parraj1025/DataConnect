//determine modules and functions being used

const inquirer = require('inquirer');
const pool = require('./config/connection');
const dowork = require('./controllers/main');


//creates function to test and establish data tables

async function init() {

    console.log('welcome, make sure you add department to add roles and then employee')
    try {

        const client = await pool.connect()

        const tableQuery = `
        create table IF NOT EXISTS department(
          id SERIAL PRIMARY KEY,
          name VARCHAR(30) NOT NULL
        );
   
        create table IF NOT EXISTS role(
            id SERIAL PRIMARY KEY,
            name VARCHAR(30) not null,
            salary integer not null,
            department_id integer,
            foreign key (department_id) references department(id)
        );
        
        CREATE TABLE IF NOT EXISTS employee (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(30) NOT NULL,
          last_name VARCHAR(30) NOT NULL, 
          manager VARCHAR(30),
          role_id INTEGER,
          FOREIGN KEY (role_id) REFERENCES role(id),
          department_id INTEGER,
          FOREIGN KEY (department_id) REFERENCES department(id)
        );`

        const tables = await client.query(tableQuery)

        if (tables) {

            console.log('tabled are good')
        }

        dowork()

    }

    catch (error) {
        console.log(error)
    }
}
//initiates server on start up
init()