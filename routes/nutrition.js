const express = require("express")
const security = require("../middleware/security")
const Nutrition = require("../models/nutrition")
const router = express.Router()

router.post("/record-nutrition", security.requireAuthenticatedUser, async (req, res, next)=>{
    try {
        const user = res.locals.user
        // console.log(req.body)
        // console.log(user)
        const nutrition = await Nutrition.recordNutrition({data:req.body, user})
        return res.status(201).json({nutrition})
    } catch (error) {
        next(error)
    }
})

router.get("/", security.requireAuthenticatedUser, async (req, res, next) =>{
    try{ 
    const {user} = res.locals
    console.log("fetch", user)
    const food = await Nutrition.fetchNutrition(user)
    return res.status(200).json({ food })
 }  catch(err){
     next(err)
 }
 })

 router.get("/", security.requireAuthenticatedUser, async (req, res, next)=>{
     try {
         const { user } = res.locals
         const daily = await Nutrition.fetchDailyNutrition(user)
         return res.status(200).json({ daily })
     } catch (err) {
         next(err)
     }
 })
module.exports = router