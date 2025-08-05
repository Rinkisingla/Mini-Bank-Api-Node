 import { Router } from "express";
  import {transfermoney,history} from '../controllers/transitioncontrollers.js'
   import verifyjwt from "../middleware/auth.middleware.js"
  const transitionRouter = Router();

transitionRouter.route('/transfermoney').post(verifyjwt,transfermoney);
transitionRouter.route('/history').get(verifyjwt,history);
 export default transitionRouter;