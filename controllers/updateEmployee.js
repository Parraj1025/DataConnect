const inquirer = require('inquirer')
const pool = require('../config/connection')
const addEmp= require('./addEmployee')



async function update(employee) {
    const client = await pool.connect()
    const newData = await addEmp()
    console.log(newData)
    const updatedEmployee = {
        first_name: await newData.firstname,
        last_name: await newData.lastname,
    }
    console.log(updatedEmployee)


    const deptQuery = await client.query(`select id from department d where name = '${newData.dept}';`)
    console.log(deptQuery.rows[0].id)
    const deptId = deptQuery.rows[0].id
    const roleQuery = await client.query(`select id from role where name = '${newData.role}';`)
    console.log(roleQuery.rows[0].id)
    const roleId = roleQuery.rows[0].id

    const managerId = await client.query(`select id from role where "name" = 'Manager' and department_id = ${deptId};`)
    console.log(`managerId = ${managerId.rows[0].id}`)
    let assignedManager = managerId.rows[0].id
    if(!assignedManager){
        assignedManager = 'no manager assigned'
    }

    const manager =
        await client.query(`select first_name, last_name from employee where role_id = ${assignedManager} and department_id = ${deptId};`)
    console.log(manager.rows)

    if (manager.rows.length == 0) {
        const relevantManager = ''
        console.log('no current manager')

        const updateQuery = await client.query(`UPDATE employee 
        SET first_name  = '${updatedEmployee.first_name}', last_name  = '${updatedEmployee.last_name}', manager = '${relevantManager}', role_id = ${roleId}, department_id = ${deptId}
        WHERE  id = 1;`)

      console.log(updateQuery)
    
}}

module.exports = update