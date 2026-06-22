const mongoose = require('mongoose')
const dotenv = require('dotenv')

// config .env
dotenv.config()
// connect db
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('MONGODB is connected')
    }catch(error){
        console.log(error)
    }
}

module.exports = connectDB