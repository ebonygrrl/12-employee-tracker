const cTable = require('console.table');

// functions designated to show each mysql query

// department
const showDeptTables = sql => {
    //console.log(sql);

    let newSql = sql.map((item) => ({ id: item.id, name: item.dept_name }));
    
    console.table(newSql);
} 

// roles
const showRoleTables = sql => {

    let newSql = sql.map((item) => ({ id: item.id, title: item.title, salary: item.salary}));
    
    console.table(newSql);
}  

// employees
const showEmployeeTables = sql => {

    let newSql = sql.map((item) => (
        { id: item.id, 
          first: item.first_name, 
          last: item.last_name, 
          role: role_id, 
          manager: manager_id, 
          title: item.title, 
          salary: item.salary
        }
    ));
    
    console.table(newSql);
}  

// export back to mysql as an object
module.exports = { showDeptTables, showRoleTables, showEmployeeTables };

