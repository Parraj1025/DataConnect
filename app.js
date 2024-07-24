const inquirer = require('inquirer');
const pool = require('./config/connection');
const dowork = require('./controllers/main');


async function init() {
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
            department_id integer,
            foreign key (department_id) references department(id)
        );
        
        CREATE TABLE IF NOT EXISTS employee (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(30) NOT NULL,
          last_name VARCHAR(30) NOT NULL,
          salary integer not null, 
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
// const client = await pool.connect()

// const storedData = await client.query(Query)


init()
