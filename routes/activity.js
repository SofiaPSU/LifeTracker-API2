const express = require("express")
const security = require("../middleware/security")
const Nutrition = require("../models/nutrition")
const router = express.Router()


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