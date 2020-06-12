import * as express from 'express'
import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import IControllerBase from '../../interfaces/IControllerBase.interface'
import { packagesList } from '../../packages/index'
import { GITHUB_TOKEN } from '../../utils/config'
import { GithubPackageLatest, GithubPackageAllVersions } from '../../types'
import { latest, allVersions } from '../../../dummyData'

class GitHubAPIController implements IControllerBase {
    public path = '/github'
    public router = express.Router()
    // private _packagesLatest: GithubPackageLatest[] = []
    // private _packagesAllVersions: GithubPackageAllVersions[] = []
    private _packagesLatest: GithubPackageLatest[] = latest
    private _packagesAllVersions: GithubPackageAllVersions[] = allVersions


    constructor() {
        this.initRoutes()
        // this.getAllVersions()
    }


    public initRoutes = () => {
        this.router.get('/testAPI', this.dummyGet)
        this.router.get('/getUpdatedVersions', this.getUpdatedVersion)
        this.router.post('/dataByPackageName', this.dataByPackageName)
    }

    private getAllVersions() {
        packagesList.forEach((pkg: string) => {
            // const pkg = "acidanthera/OpenCorePkg"
            const [user, repo] = pkg.split('/')
            const { url, config } = this.GitHubAPIURL(user, repo, false)
            Axios.get(url, config)
                .then((res: AxiosResponse) => {
                    if (res.data[0] !== undefined) {
                        this._packagesLatest.push({ package: pkg, version: res.data[0].tag_name, release_id: res.data[0].id })
                    }
                    this._packagesAllVersions.push({ package: pkg, version: res.data.map((x: any) => ({ release_id: x.id, release_version: x.tag_name })) })
                })
                .catch((err: AxiosError) => console.error("ERROR", err))

        })
    }

    private GitHubAPIURL = (user: string, repo: string, latest: boolean, version?: string | number | undefined): { url: string, config: AxiosRequestConfig } => {
        return { url: `https://api.github.com/repos/${user}/${repo}/releases${version ? `/${version}` : ""}${latest ? `/latest` : ""}`, config: { headers: { Authorization: `Token ${GITHUB_TOKEN as string}` } } }
    }

    private dummyGet = (req: Request, res: Response) => {
        res.status(200).send({ message: "SUCCESS" })
    }

    private getUpdatedVersion = (req: Request, res: Response): void => {
        res.status(200).send({ latest: this._packagesLatest, status: 200, allVersions: this._packagesAllVersions, message: "Retrieved data Successfully!" })
    }

    private dataByPackageName = (req: Request, res: Response): void => {
        const user: string | undefined = req.body.user?.toString()
        const repo: string | undefined = req.body.repo?.toString()
        const version: string | undefined = req.body.version?.toString()
        if (user === undefined || repo === undefined) {
            res.send(400).send({ status: 400, message: "Bad Request, missing Parameters" })
        } else {
            if (version !== undefined) {
                // Need to change code from and replace release_id with release_version due to an earlier mistake.
                const specificVersion = this._packagesAllVersions.map(pkg => {
                    if (pkg.package === `${user}/${repo}`) {
                        const foundVersion = pkg.version.find(pkgV => pkgV.release_id == version)
                        return foundVersion
                    }
                    return null
                }).filter(Boolean)

                const { url, config } = this.GitHubAPIURL(user, repo, false, specificVersion[0]?.release_version)

                Axios.get(url, config)
                    .then((apiData) => {
                        res.status(200).send({ version: specificVersion, message: "SPECIFIC VERSION RELEASE", data: apiData.data })
                    })
                    .catch(err => console.log("error here", err))
            } else {
                const latestVersion = this._packagesLatest.find(pkg => pkg.package === `${user}/${repo}` && pkg.version)
                const { url, config } = this.GitHubAPIURL(user, repo, true)
                Axios.get(url, config)
                    .then((apiData) => {
                        res.status(200).send({ version: latestVersion, message: "LATEST RELEASE", data: apiData.data })
                    })
                    .catch(err => console.log("error here", err))
            }

        }
    }
}

export default GitHubAPIController