const inquirer = require("inquirer")

const deptQuestion =[]
    

async function addDept() {

    let answers = '';
  await  inquirer.prompt(
       {
        name: "department",
        type: "input",
        message: "Which department is being added?"
       }
    )
    .then((answer) => {
        answers = answer.department
    })
    return answers
}

module.exports =  addDept