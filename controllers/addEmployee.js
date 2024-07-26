const inquirer = require('inquirer')
const pool = require('../config/connection')

async function getDept() {
    const client = await pool.connect()
    const currentDept = await client.query('select * from department')
    return currentDept.rows
}

async function getRoles(){
    const client = await pool.connect()
    const currentRoles = await client.query('select * from role;')
    return currentRoles.rows
}






async function addEmp(){
    const depts = await getDept()
    const roles = await getRoles()

    let newEmployee = {}
    const employeeQs = [
        {
            name: "first_name",
            type: 'input',
            message: 'enter first name'
        },
        {
            name: "last_name",
            type: 'input',
            message: 'enter last name'
        },
        {
            name: "role",
            type: 'list',
            choices: roles,
            message: 'what role will they take'
        },
        {
            name: 'dept',
            type: 'list',
            choices: depts,
            message: 'under what department will they fall'
        }
    
    ]

    await inquirer.prompt(employeeQs).then(async (answer) => {
        const Employee = await answer
        newEmployee = {
            firstname: Employee.first_name,
            lastname: Employee.last_name,
            role: Employee.role,
            dept: Employee.dept
        } 
    })
    
    return newEmployee
}

module.exports = addEmp, getDept, getRoles