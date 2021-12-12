import { Express, Request, Response } from "express";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import deserializeUser from "./middleware/deserializeUser";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchmema } from "./schema/user.schema";

export default function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
  })


  // Register User
  // POST /api/users
  app.post('/api/users', validate(createUserSchmema), createUserHandler);

  // Login User
  // POST /api/sessions
  app.post('/api/sessions', validate(createSessionSchema), createUserSessionHandler)

  // Get the Users sessions
  // GET /api/sessions
  app.get('/api/sessions', requireUser, getUserSessionsHandler)

  // Logout
  // DELETE /api/sessions
  app.delete('/api/sessions', requireUser, deleteSessionHandler)
}