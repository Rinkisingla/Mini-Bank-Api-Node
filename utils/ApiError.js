 class ApiError extends Error{
    constructor( status, message="Something went wrong", error, stack){
         super(message);
         this.status= status,
         this.message=message,
         this.error= error,
         this.success =false,
         this.data= null
        
      if(stack){
         this.stack= stack
      }
      else{
        Error.captureStackTrace(this, this.constructor)
      }
    }
 }
 export default ApiError
