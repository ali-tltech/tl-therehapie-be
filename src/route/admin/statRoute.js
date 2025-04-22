import express from 'express'
import { totalCounts } from '../../controller/statController.js'
const router =express.Router()

router.get('/total-counts',totalCounts)

export default router