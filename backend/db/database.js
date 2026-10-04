import mongoose from "mongoose";


export const database = async()=>{
    try {
        
      const conn =  await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected database: ${conn.connection.host}`)
    } catch (error) {
        console.log(error.message)
    }
}