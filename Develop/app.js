const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const { strikethrough } = require("colors");
const { validateName, validateNumber, emailChecker, githubAccountValidate } = require("./utils/validate")

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = [];

const managerPrompt = [
    {
        type: "input",
        message: "Please input Manager name: ".magenta,
        name: "name",
        validate: validateName,
    },
    {
        type: "input",
        message: "Please input Manager ID: ".magenta,
        name: "id",
        validate: validateNumber
    },
    {
        type: "input",
        message: "Please enter Manager Email Address: ".magenta,
        name: "email",
        validate: emailChecker
    },

    {
        type: "input",
        message: "Please enter Manager's office Number: ".magenta,
        name: "officeNumber",
        validate: validateNumber,        
    },
    {
        type: 'confirm',
        name: 'addTeam',
        message: 'Would you like to add team members under this manager: ?'.yellow,
        choices: ["Yes", "No"]
    },]

const teamPrompt = [
    {
        type: "input",
        message: "Please input Team member name: ".magenta,
        name: "name",
        validate: validateName
    },
    {
        type: "input",
        message: "Please input Team member ID: ".magenta,
        name: "id",
        validate: validateNumber
    },
    {
        type: "input",
        message: "Please enter Team member Email Address: ".magenta,
        name: "email",
        validate: emailChecker
    },
    {
        type: "list",
        message: "Please select role of the employee: ".magenta,
        name: "role",
        choices: [
            "Engineer",
            "Intern",
        ]
    },
    {
        type: "input",
        message: "Please enter Engineer Github username: ".magenta,
        name: "github",
        validate: githubAccountValidate,
        when: (response) => response.role === 'Engineer'
    },
    {
        type: "input",
        message: "Please enter Intern school Name: ".magenta,
        name: "school",
        validate: validateName,
        when: (response) => response.role === 'Intern'
    },
    {
        type: "confirm",
        name: "another",
        message: "Do you want to add another Team member: ?".yellow,
        choices: ["Yes", "No"]
    },
];
//Clears console and displays initialization message
function Initializing() {
    console.clear();
    console.log("\nStarting Engineering Team Building ...\n".green);
}
//function to initialize program
Initializing()

//Manager Array
const managerArray = async (managerDetails = []) => {
    const { Manager, ...answers } = await inquirer.prompt(managerPrompt);
    const addManagerInitial = [...managerDetails, answers]
    //Manually Add 'role' to Manager to enable uniform manipulation of final array
    const addManager = addManagerInitial.map(e => ({ ...e, role: "Manager" }))
    return addManager;
}

//Team Member Array
const teamArray = async (teamDetails = []) => {
    const { another, ...answers } = await inquirer.prompt(teamPrompt);
    const addTeamMembers = [...teamDetails, answers]
    //console.log(addTeamMembers)
    return another ? teamArray(addTeamMembers) : addTeamMembers;
}

//Main function 
const main = async () => {
    let finalArray = [];
    await new Promise(resolve => setTimeout(resolve, 2000));
    const newManagerArray = await managerArray();

    //Concats new team member array to existing manager array
    if (newManagerArray[0].addTeam === true) {
        const finalArray = newManagerArray.concat(await teamArray());
        //console.log(finalArray)

        //Filter Manager ONLY from the Array and construct an instance of Manager
        const ManagerArrayOnly = finalArray.filter(finalArray => finalArray.role === "Manager")
        // console.log(ManagerArrayOnly)
        const newManager = new Manager(ManagerArrayOnly[0].name, ManagerArrayOnly[0].id, ManagerArrayOnly[0].email, ManagerArrayOnly[0].officeNumber)
        //console.log(newManager)
        employees.push(newManager)
        //console.log(employees)
        //Filter Engineer ONLY fron the Array and construct an instance of Engineer
        const EngineerArrayOnly = finalArray.filter(finalArray => finalArray.role === "Engineer")
        for (engineer in EngineerArrayOnly) {
            const newEngineer = new Engineer(EngineerArrayOnly[engineer].name, EngineerArrayOnly[engineer].id, EngineerArrayOnly[engineer].email, EngineerArrayOnly[engineer].github)
            //console.log(newEngineer)
            employees.push(newEngineer)
        }


        //Filter Interns ONLY and construct and instance of Intern
        const InternArrayOnly = finalArray.filter(finalArray => finalArray.role === "Intern")
        //console.log(InternArrayOnly)
        for (intern in InternArrayOnly) {
            const newIntern = new Intern(InternArrayOnly[intern].name, InternArrayOnly[intern].id, InternArrayOnly[intern].email, InternArrayOnly[intern].school)
            // console.log(newIntern)
            employees.push(newIntern)
        } 
        //console.log(employees)
        //console.log(render)
        
    } else {
        //Filter Manager ONLY from the Array and construct an instance of Manager
        const ManagerArrayOnly = newManagerArray.filter(newManagerArray => newManagerArray.role === "Manager")
        const newManager = new Manager(ManagerArrayOnly[0].name, ManagerArrayOnly[0].id, ManagerArrayOnly[0].email, ManagerArrayOnly[0].officeNumber)
        //console.log(newManager)
        employees.push(newManager)
    }
    fs.writeFile(outputPath, render(employees), (err) => {
        if (err) throw "\nTeam Profile page generation failed. Please revalidate your input values\n";
        console.log("\nTeam profile page successfully generated. Please see at the directory: ".green+__dirname+"\n");
    });
    };
    main();
