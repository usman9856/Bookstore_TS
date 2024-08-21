import { Request, Response, NextFunction } from 'express';


const asyncErrorHandler= (func: (req: Request, res: Response, next: NextFunction) => Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      func(req, res, next).catch(error => next(error));
    };
  };
  

  export default asyncErrorHandler;