const cTable = require('console.table');

const showDeptTables = sql => {
    console.log('TABLES -------------------');
    //console.log(sql);   

    let newSql = sql.map((item) => ({ id: item.id, name: item.dept_name }));
    
    console.table(newSql);
}    
    
module.exports = showDeptTables;