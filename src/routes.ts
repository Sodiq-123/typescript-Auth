import { Express, Request, Response } from "express";
import { createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler } from "./controller/session.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validate from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchmema } from "./schema/user.schema";
import { createProductHandler, deleteProductHandler, getProductHandler, updateProductHandler } from "./controller/product.controller";
import { createProductSchema, deleteProductSchema, getProductSchema, updateProductSchema } from "./schema/product.schema";

export default function routes(app: Express) {
  app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the API');
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

  app.post("/api/products", [requireUser, validate(createProductSchema)], createProductHandler);

  app.put("/api/products/:productId", [requireUser, validate(updateProductSchema)],
    updateProductHandler
  );

  app.get("/api/products/:productId", validate(getProductSchema), getProductHandler);

  app.delete("/api/products/:productId",[requireUser, validate(deleteProductSchema)],
    deleteProductHandler
  );
}