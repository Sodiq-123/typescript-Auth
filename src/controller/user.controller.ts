import { Request, Response } from "express";
import { omit } from "lodash";
import log from "../utils/logger";
import { createUser } from "../service/user.service";
import { createUserInput } from "../schema/user.schema";

export async function createUserHandler(req: Request<{}, {}, createUserInput["body"]>, res: Response) {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user, "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
