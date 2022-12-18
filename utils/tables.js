const cTable = require('console.table');

const showDeptTables = sql => {

    let newSql = sql.map((item) => ({ id: item.id, name: item.dept_name }));
    
    console.table(newSql);
} 

const showRoleTables = sql => {

    let newSql = sql.map((item) => ({ id: item.id, title: item.title, salary: item.salary}));
    
    console.table(newSql);
}  
    
module.exports = function() {
    showDeptTables();
    showRoleTables();
};