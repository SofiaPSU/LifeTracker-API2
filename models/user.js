const db= require("../db")
const { BadRequestError, UnauthorizedError } = require("../utils/errors")
const bcrypt =require("bcrypt")
const { BCRYPT_WORK_FACTOR } =require("../config")

class User{
    static makePublicUser(user){
        return{
            id: user.id,
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
        }
    }


    static async login(credentials){
        //user submits email and password 
        //if any fields missing throw error
        const requiredFields = ["email", "password"]
        requiredFields.forEach(field =>{
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        })
        //lookup user in db by email
        const user = await User.fetchUserByEmail(credentials.email)
        //if found compare passwords
        //if match return user
        //if wrong, throw error
        if (user){
            const isValid = await bcrypt.compare(credentials.password, user.password)
            if (isValid){
                return User.makePublicUser(user)
            }
        }

        throw new UnauthorizedError("Invalid email/password combo")
    }

    static async register(credentials){
        //user submits email and password
        //if fields missing throw an error
        const requiredFields = ["email","username","first_name","last_name", "password"]
        requiredFields.forEach(field =>{
            if(!credentials.hasOwnProperty(field)){
                throw new BadRequestError(`Missing ${field} in request body`)
            }
        })
        if (credentials.email.indexOf("@") <=0){
            throw new BadRequestError("Invalid email")
        }
        // make sure unique email
        const existingUser = await User.fetchUserByEmail(credentials.email)
        if(existingUser){
            throw new BadRequestError(`Duplicate email: ${credentials.email}`)
        }
        //take users password and hash it
        //take users email and lowercase it
        const lowercasedEmail = credentials.email.toLowerCase()
        const hashedPw = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR)
        const normalizedUsername = credentials.username.toLowerCase()
        // create a new user in db with their info
        const result = await db.query(
           ` INSERT INTO users (
                email, username, first_name, last_name, password
            )VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, username, first_name, last_name, password, is_admin;`, [lowercasedEmail, normalizedUsername,
            credentials.first_name, credentials.last_name, hashedPw])
        //return user
        const user = result.rows[0]
        return User.makePublicUser(user)
    }

    static async fetchUserByEmail(email){
        if(!email){
            throw new BadRequestError("No email provided")
        }
        const query =`SELECT * FROM users WHERE email =$1`
        const result = await db.query(query, [email.toLowerCase()])
        const user = result.rows[0]
        return user
    }
    static async fetchUserByUsername(username){
        if(!username){
            throw new BadRequestError("No username provided")
        }
        const query =`SELECT * FROM users WHERE username =$1`
        const result = await db.query(query, [username])
        const user = result.rows[0]
        return user
    }
}

module.exports = User