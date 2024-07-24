const pool = require('../config/connection')
const inquirer = require("inquirer")
    
async function getDept() {
    const client = await pool.connect()
    const depts = await client.query(`select * from department d ;`)
    const options = depts.rows.map((dept) => ({id: dept.id, name: dept.name}))

    return options

}





async function addRole() {

    const Depts = await getDept();


    let newRole = ''
    let workingDept = ''
    
    const questions = [    {
        name: "role",
        type: "list",
        message: "which role will they play?",
        choices: ['Associate','Supervisor', 'Manager']
       },
       {
        name: "dept",
        type: 'list',
        message: `under what department? ${Depts}`,
        choices: Depts
       }]
  await  inquirer.prompt(questions)
    .then((answer) => {
        newRole = answer.role
        workingDept = {
            role:answer.role,
            dept: answer.dept
        }

        console.log(newRole)
        console.log(workingDept)
       
    })
    return workingDept
}

module.exports = addRole
