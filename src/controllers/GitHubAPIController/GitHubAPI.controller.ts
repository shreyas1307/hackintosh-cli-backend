import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import IControllerBase from '../../interfaces/IControllerBase.interface'

class GitHubAPIController implements IControllerBase {
    public path = '/github'
    public router = express.Router()

    constructor() {
        this.initRoutes()
    }

    public initRoutes() {
        this.router.post('/getUpdatedVersions', this.getUpdatedVersion)
        this.router.post('/dataByPackageName', this.dataByPackageName)
    }

    private getUpdatedVersion(req: Request, res: Response): void {
        const body = req.body
        console.log(body)
        res.status(200).send("Hello")
    }

    private dataByPackageName(req: Request, res: Response): void {
        const body = req.body
        console.log(body)
        res.status(200).send("Hello")
    }
}

export default GitHubAPIController