import express from 'express';
import {
    createSocial,
    getAllSocials,
    getSocialById,
    updateSocial,
    deleteSocial
} from '../../controller/social.controller.js';
import verifyJwtToken from '../../middlewares/verifyJwtToken.js';

const router = express.Router();

router.post('/create-social', createSocial); 
router.get('/get-social',verifyJwtToken, getAllSocials); 
router.get('/get-social/:id', verifyJwtToken,getSocialById); 
router.put('/update-social/:id',verifyJwtToken, updateSocial);
router.delete('/delete-social/:id', deleteSocial); 

export default router;