const db= require("../db")
const { BadRequestError, UnauthorizedError, NotFoundError } = require("../utils/errors")

class Nutrition{
    static async recordNutrition({data, user }){
        console.log("data from backend", data)
        const requiredFields = ["name", "quantity","calories"]
        requiredFields.forEach(field =>{
            if(!data?.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        })
        
        const result = await db.query(
            ` INSERT INTO nutrition (
                  name, quantity, calories, category, image_url, user_id
             )VALUES ($1, $2, $3, $4, $5, (SELECT id FROM users WHERE username= $6)) 
             RETURNING id, name, quantity, calories, user_id;`, [ data.name,
                data.quantity, data.calories, data.category, data.image_url, user.username])
        console.log("backend",user.username)
         const nutritionData = result.rows[0]
         return nutritionData
    }

    static async fetchNutrition( user ){
        const result = await db.query(`SELECT * FROM nutrition
        WHERE user_id=(SELECT id FROM users WHERE username=$1) ORDER BY timestamp DESC`, [user.username])
        const nutrition = result.rows
        if (nutrition){
        return nutrition}
        else{ throw new NotFoundError("Nutrition data could not be found")}
    }
    static async fetchDailyNutrition (user){
        const result = await db.query(
            `SELECT calories FROM nutrition
            WHERE user_id=(SELECT id FROM users WHERE username=$1) AND DATE(timestamp)= (SELECT CONVERT(date, GETDATE()))`, [user.username]
        )
        const dailyFood = result.rows
        if (dailyFood){
            return dailyFood
        }
        else { throw new NotFoundError("Nutrition data could not be found") }
    }
    
}
module.exports = Nutrition