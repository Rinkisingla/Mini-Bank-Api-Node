 import {Router} from "express";
  import verifyjwt from "../middleware/auth.middleware.js"
 import {registerbankaccount, viewBalance} from "../controllers/backAccountController.js";
 const bankrouter = Router()
 bankrouter.route('/registerbankaccount').post(verifyjwt,registerbankaccount);
 bankrouter.route('/viewbalance').get(verifyjwt,viewBalance);

 export  default bankrouter