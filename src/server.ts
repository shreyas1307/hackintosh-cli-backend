import App from './app'

import * as BodyParser from 'body-parser';
import cors from 'cors';

import GitHubAPIController from './controllers/GitHubAPIController/GitHubAPI.controller'

import loggerMiddleware from './middleware/logger'
import { PORT } from './utils/config';

const app = new App({
    port: PORT || 1307,
    middleware: [
        BodyParser.json(),
        BodyParser.urlencoded({ extended: true }),
        cors(),
        loggerMiddleware
    ],
    controller: [{
        route: '/github', endpoint: new GitHubAPIController()
    }]
})

app.listen()
