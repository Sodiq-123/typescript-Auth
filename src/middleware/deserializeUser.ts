import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash'
import { reIssueAccessToken } from '../service/session.service';
import { decode } from '../utils/jwt.utils';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
 const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "")
 const refreshToken = get(req, "headers.x-refresh", "")

  if (accessToken) {
    const { decoded, expired } = decode(accessToken)

    if (decoded) {
      res.locals.user = decoded
    }
     
    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({refreshToken})

      if (newAccessToken) {
        res.setHeader('x-access-token', newAccessToken)
      }

      const result = decode(newAccessToken as string)
      res.locals.user = result.decoded
      next()
    }
  }

  return next()
}

export default deserializeUser