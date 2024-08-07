const addDept = require('./addDept');
const addRole = require('./addRole');
const addEmp = require('./addEmployee');
const update = require('./updateEmployee')
const inquirer = require('inquirer');
const pool = require('../config/connection');
const { init } = require('../../Social/models');


//this does all the work using functions from other files to gather information needed for each function of the app

const questions = [
    {
        name: "task",
        type: 'list',
        choices: ['add department', 'add role', 'add employee', 'view all departments', 'view all roles', 'view all employees', 'update employee',"exit"],
        message: 'what do you want to do?',
    }
]

async function dowork() {
    let loop = true
    const client = await pool.connect()
    if (loop == true){
    try {
        inquirer.prompt(questions).then(async (answers) => {
            if (answers.task == 'add department') {
                let newDept = await addDept()

                const deptQuery = `insert into department(name)
                values ('${newDept}');`;

                const addedDept = await client.query(deptQuery)
            }
            if (answers.task == 'add role') {
                const roleInfo = await addRole()
                console.log(roleInfo)
                const idQuery = await client.query(`select id from department d where name = '${roleInfo.dept}';`)

                const matchingId = idQuery.rows[0].id
                const newRole = roleInfo.role
                const newSalary = roleInfo.sal



                const newRoleQuery = await client.query(`insert into role(name, salary, department_id)
            values ('${newRole}',${newSalary}, ${matchingId});`)

                if (newRoleQuery) {
                    console.log('new role added')
                }
            }
            if (answers.task == 'add employee') {
                const employeeData = await addEmp()

                const newEmployee = {
                    first_name: await employeeData.firstname,
                    last_name: await employeeData.lastname,
                }
                console.log(employeeData)


                const deptQuery = await client.query(`select id from department d where name = '${employeeData.dept}';`)
                console.log(deptQuery.rows[0].id)
                const deptId = deptQuery.rows[0].id
                const roleQuery = await client.query(`select id from role where name = '${employeeData.role}';`)
                console.log(roleQuery.rows[0].id)
                const roleId = roleQuery.rows[0].id

                const managerId = await client.query(`select id from role where "name" = 'Manager' and department_id = ${deptId};`)
                let assignedManager =''
               if (!managerId.rows.id){
                 assignedManager = null
               }
               else{
                 assignedManager = managerId.rows[0].id
               }

                const manager =
                    await client.query(`select first_name, last_name from employee where role_id = ${assignedManager} and department_id = ${deptId};`)
                console.log(manager.rows)

                if (manager.rows.length == 0) {
                    const relevantManager = null
                    console.log('no current manager')

                    const newEmployeeQuery = await client.query(`insert into employee(first_name,last_name, manager, role_id,department_id)
                values ('${newEmployee.first_name}','${newEmployee.last_name}', '${relevantManager}', ${roleId}, ${deptId});`)

                    if(newEmployeeQuery){
                        console.log('employee added')
                        
                    }
                    
                }

                else {

                    const options = await manager.rows;
                    const choicess = await options.map((option) => ({
                        name: `${option.first_name} ${option.last_name}`,
                        value: `${option.first_name} ${option.last_name}`
                    })
                    )

                    const managerss = await choicess
                    console.log(managerss)

                    console.log(await choicess)

                    await inquirer.prompt({
                        name: 'manager',
                        type: 'list',
                        choices: choicess,
                        message: 'who will be their manager',
                        

                    })
                        .then(async (answers) => {
                            const relevantManager = await answers.manager
                            console.log(relevantManager)
                            const newEmployeeQuery = await client.query(`insert into employee(first_name,last_name, manager, role_id,department_id)
                values ('${newEmployee.first_name}','${newEmployee.last_name}', '${relevantManager}', ${roleId}, ${deptId});`)

                console.table(newEmployeeQuery)
                        })
                }
            }
            if (answers.task == 'view all departments') {
                const allDepts = await client.query('select * from department;')
                const Depts = await allDepts.rows
                console.table(Depts)
            }

            if (answers.task == 'view all roles') {
                const allRoles = await client.query('select r.name as role, r.salary as salary, d.name as department from role r inner join department d on r.department_id = d.id ;')
                const roles = await allRoles.rows

                console.table(roles)
                process.exit(0)
            }

            if (answers.task == 'view all employees') {
                const allEmps = await client.query(`select e.id as Employee_ID, e.first_name as first_name, e.last_name as last_name, r.name as role, d.name as department, e.manager as manager, r.salary as salary from employee e inner join role r on e.role_id = r.id inner join department d on e.department_id = d.id;`)
                console.table(allEmps.rows)
                
            }
            
            if (answers.
                task == 'update employee'){
                const currentEmployee = await client.query('select * from employee;')
                const employeeOptions = await currentEmployee.
                rows.map((employee) =>({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: {
                        first_name: employee.first_name,
                        last_name: employee.last_name
                    }
                }))
                console.table(employeeOptions)

                let chosenEmployee = ''

                
                await inquirer.prompt({
                    name: 'chosenemp',
                    type: 'list',
                    choices: employeeOptions,
                    message: 'who do you want to update'
                }).then(async(answer) => {
                    console.log(answer.chosenemp)
                    chosenEmployee = answer.chosenemp
                    const newData = await update(chosenEmployee)
                })
                console.log(chosenEmployee)
            }
            if (answers.task == 'exit'){
               process.exit(0)
            }
            let loop = true
            dowork()
    })
}
    catch (error) { console.log(error);} finally{
    }}

   
}


module.exports = dowork

