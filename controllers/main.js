const addDept = require('./addDept');
const addRole = require('./addRole');
const inquirer = require('inquirer');
const pool = require('../config/connection');



const questions = [
    {
        name: "task",
        type: 'list',
        choices: ['add department', 'add role', 'add employee', 'view all departments', 'view all roles', 'view all employees', 'update employee'],
        message: 'what do you want to do?',
    }
]

async function dowork(){

    const client = await pool.connect()
try{
    inquirer.prompt(questions).then(async (answers) => {
        if (answers.task == 'add department') {
                let newDept = await addDept()
    
                const deptQuery = `insert into department(name)
                values ('${newDept}');`;
    
                const addedDept = await client.query(deptQuery)
    
    
                console.log(addedDept)
            }
        if (answers.task == 'add role'){
            const roleInfo = await addRole()
            console.log(roleInfo)
            const idQuery = await client.query(`select id from department d where name = '${roleInfo.dept}';`)

            const matchingId = idQuery.rows[0].id
            const newDept = roleInfo.dept

            

            const newRoleQuery = await client.query(`insert into role(name,department_id)
            values ('${newDept}', ${matchingId});`)

            if(!newRoleQuery){
                'done'
            }
            
        }
    })
}
catch(error){console.log(error)}
}

module.exports = dowork

