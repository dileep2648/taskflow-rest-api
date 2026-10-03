const AppError = require("../utils/AppError");
const {pool} = require("../db/db");


const getTasks = async (query)=>{
    let sql = "SELECT * FROM tasks";
    const values = [];
    const conditions = [];

    if(query.completed!==undefined){
        values.push(query.completed=== "true");
        conditions.push(`completed = $${values.length}`)
    }

    if(query.search !== undefined){
        values.push(`%${query.search}`);
        conditions.push(`title ILIKE $${values.length}`)
    }

    if(conditions.length>0){
        sql+=" WHERE " + conditions.join(" AND ");
    }

    if (query.sort === "title") {
        sql += " ORDER BY title";

        if (query.order === "desc") {
            sql += " DESC";
        } else {
            sql += " ASC";
        }
    }
    
     if (query.page !== undefined && query.limit !== undefined) {
        const page = Number(query.page);
        const limit = Number(query.limit);
        const offset = (page - 1) * limit;

        values.push(limit);
        sql += ` LIMIT $${values.length}`;

        values.push(offset);
        sql += ` OFFSET $${values.length}`;
    }

    const result = await pool.query(sql, values);
    if(result.rows.length===0)throw new AppError("No tasks found", 404);
    return result.rows;
    
}



const getTaskById = async (id)=>{
    const result  = await pool.query("SELECT * FROM tasks WHERE id = $1",[id]);
    if(result.rows.length===0)throw new AppError("Failed to find task", 404);
    return result.rows[0];
}
  


const createTask =async (taskData)=>{
    const result = await pool.query(
        `INSERT INTO tasks (title,completed)
        VALUES ($1,$2)
        RETURNING *`,
        [taskData.title,taskData.completed]
    );
    if(result.rows.length===0)throw new AppError("Failed to create task", 400);
    return result.rows[0];
}

const updateTask = async(id,taskData)=>{
    const result = await pool.query(`
        UPDATE tasks
        SET title=$1,completed =$2
        WHERE id = $3
        RETURNING *`,
    [taskData.title,taskData.completed,id]);
    if(result.rows.length===0)throw new AppError("Failed to update task", 404);
    return result.rows[0];

}

const patchTask = async (id, taskData) => {
    const fields = [];
    const values = [];
    let index = 1;

    if (taskData.title !== undefined) {
        fields.push(`title = $${index}`);
        values.push(taskData.title);
        index++;
    }

    if (taskData.completed !== undefined) {
        fields.push(`completed = $${index}`);
        values.push(taskData.completed);
        index++;
    }

    if (fields.length === 0) {
        throw new AppError("No fields provided for update", 400);
    }

    values.push(id);

    const result = await pool.query(
        `UPDATE tasks
         SET ${fields.join(", ")}
         WHERE id = $${index}
         RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        throw new AppError("Failed to update task", 404);
    }

    return result.rows[0];
};

const deleteTask =async (id)=>{
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *",[id]);
    if(result.rows.length===0)throw new AppError("Failed to delete task", 404);
    return result.rows[0];
}

module.exports = {
    getTasks,getTaskById,createTask,updateTask,patchTask,deleteTask
};
    