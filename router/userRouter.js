import {Router} from 'express'
import { userRegister, loginuser } from '../controllers/usercontroller.js'
 const router = Router();

 router.route('/register').post(userRegister);
 router.route('/login').post(loginuser);
 export default router