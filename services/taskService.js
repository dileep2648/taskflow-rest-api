const AppError = require("../utils/AppError");
const {pool} = require("../db/db");


const getTasks = async (query,userId)=>{
    let sql = "SELECT * FROM tasks";
    const values = [];
    const conditions = [];

    if(query.completed!==undefined){
        values.push(query.completed=== "true");
        conditions.push(`completed = $${values.length}`)
    }

    if(query.search !== undefined){
        values.push(`%${query.search}%`);
        conditions.push(`title ILIKE $${values.length}`)
    }

    conditions.push(`user_id = $${values.length+1}`);
    values.push(userId);

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



const getTaskById = async (id,userId)=>{
    const result  = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2",[id,userId]);
    if(result.rows.length===0)throw new AppError("Failed to find task", 404);
    return result.rows[0];
}
  


const createTask =async (taskData,userId)=>{
    const result = await pool.query(
        `INSERT INTO tasks (title,completed,user_id)
        VALUES ($1,$2,$3)
        RETURNING *`,
        [taskData.title,taskData.completed,userId]
    );
    if(result.rows.length===0)throw new AppError("Failed to create task", 400);
    return result.rows[0];
}

const updateTask = async(id,taskData,userId)=>{
    const result = await pool.query(`
        UPDATE tasks
        SET title=$1,completed =$2
        WHERE id = $3 AND user_id = $4
        RETURNING *`,
    [taskData.title,taskData.completed,id,userId]);
    if(result.rows.length===0)throw new AppError("Failed to update task", 404);
    return result.rows[0];

}

const patchTask = async (id, taskData, userId) => {
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
    values.push(userId);
    const result = await pool.query(
        `UPDATE tasks
         SET ${fields.join(", ")}
         WHERE id = $${index} AND user_id = $${index + 1}
         RETURNING *`,
        values
    );

    if (result.rows.length === 0) {
        throw new AppError("Failed to update task", 404);
    }

    return result.rows[0];
};

const deleteTask =async (id,userId)=>{
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",[id,userId]);
    if(result.rows.length===0)throw new AppError("Failed to delete task", 404);
    return result.rows[0];
}

module.exports = {
    getTasks,getTaskById,createTask,updateTask,patchTask,deleteTask
};
    