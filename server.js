const app = require("./app");
const { pool } = require("./db/db");
require("dotenv").config();
const PORT = process.env.PORT || 3000;


let isShuttingDown = false;
let server;

const startServer = async () => {
   try{
    await pool.query("SELECT 1");
    console.log("Database connection established successfully.");

    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
   } catch (error) {
        console.error("Error starting server:", error.message);
        try{
            await pool.end();
            console.log("Database pool is closed");
        }

        catch(error){
            console.log("Database shutdown failed:", error.message);
            process.exitCode=1;
        }
   }
}

const gracefulShutdown = async (signal) => {
   if(isShuttingDown)return ;

   isShuttingDown = true;
   console.log(`${signal} received. Shutting down server`);

   try{
       await new Promise ((resolve,reject)=>{
        server.close((error)=>{
            if(error)reject(error);
            else resolve();
        })
       })

       console.log("Server closed");
   }

   catch (error){
             console.log("HTTP server shutdown failed" , error.message);
             process.exitCode=1;
   }

   finally{
    try{
       await pool.end();
       console.log("Database pool is closed");
    }

    catch(error){
     console.log("Database shutdown failed:", error.message);
     process.exitCode=1;
    }
   }
};

process.on("SIGINT",()=>gracefulShutdown("SIGINT"));
process.on("SIGTERM",()=>gracefulShutdown("SIGTERM"));

startServer();
