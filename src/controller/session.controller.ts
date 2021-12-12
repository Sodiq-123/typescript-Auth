import config from "config";
import { Request, Response } from "express";
import { validatePassword } from "../service/user.service";
import { createSession, findSessions, updateSession } from "../service/session.service";
import { sign } from "../utils/jwt.utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  // validate the password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send("Invalid email or password");
  }

  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // create access token
  const accessToken = sign(
    { user: user._id, session: session._id },
    { expiresIn: config.get("accessTokenTtl") }
  )

  // create refresh token
  const refreshToken = sign(
    { userId: user._id, session: session._id },
    { expiresIn: config.get("refreshTokenTtl") }
  )

  // return the tokens
  res.send({accessToken, refreshToken});
}

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = res.locals.user.user

  const sessions = await findSessions({ user: userId, valid: true })

  return res.send(sessions)
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session

  await updateSession({ _id: sessionId }, { valid: false })

  return res.send({
    accessToken: null,
    refreshToken: null
  })
}