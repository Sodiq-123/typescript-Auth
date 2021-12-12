import express from 'express';
import config from "config";
import helmet from 'helmet'
import log from './utils/logger';
import connect from './utils/connect';
import routes from './routes';
import deserilizeUser from './middleware/deserializeUser';

const port = config.get<number>("port");
const host = config.get<string>("host");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(deserilizeUser)

app.listen(port, host, async () => {
  log.info(`Server is listening at http://${host}:${port}`);

  await connect();
  routes(app);
});
