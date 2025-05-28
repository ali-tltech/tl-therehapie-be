import express from "express"
import verifyJwtToken from "../../middlewares/verifyJwtToken.js"
import { createDocument, getDocumentByType } from "../../controller/document.controller.js"


const router =express.Router()

router.use(verifyJwtToken)

router.get("/:type",getDocumentByType)
router.post("/create-document",createDocument)

export default router