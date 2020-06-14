import * as express from 'express'
import Axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Request, Response, NextFunction } from 'express'
import IControllerBase from '../../interfaces/IControllerBase.interface'
import { packagesList, packagesListType } from '../../packages/index'
import { GITHUB_TOKEN } from '../../utils/config'
import { GithubPackageLatest, GithubPackageAllVersions } from '../../types'
import { getFullDateFunction } from '../../utils'
// import { latest, allVersions } from '../../../dummyData'

class GitHubAPIController implements IControllerBase {
    public path = '/github'
    public router = express.Router()
    private _packagesLatest: GithubPackageLatest[] = []
    private _packagesAllVersions: GithubPackageAllVersions[] = []
    // private _packagesLatest: GithubPackageLatest[] = latest
    // private _packagesAllVersions: GithubPackageAllVersions[] = allVersions


    constructor() {
        this.initRoutes()
        this.getAllVersions()
    }


    public initRoutes = () => {
        this.router.get('/testAPI', this.dummyGet)
        this.router.get('/getUpdatedVersions', this.getUpdatedVersion)
        this.router.post('/dataByPackageName', this.dataByPackageName)
    }

    private getAllVersions() {
        packagesList.forEach((pkg: packagesListType) => {
            // const pkg = "acidanthera/OpenCorePkg"
            const { name, endpoint } = pkg
            const [user, repo] = name.split('/')

            switch (endpoint) {
                case 'discord':
                    this._packagesLatest.push({ package: pkg.name, version: 'latest', release_id: 0, downloadLink: pkg.download })
                    this._packagesAllVersions.push({ package: pkg.name, version: [{ release_id: 0, release_version: 'latest', downloadLink: pkg.download }] })
                    return;
                case 'github':
                    const { giturl, config } = this.GitHubAPIURL(user, repo, false)
                    return Axios
                        .get(giturl, config)
                        .then((res: AxiosResponse) => {
                            if (res.data[0] !== undefined) {
                                this._packagesLatest.push({ package: pkg.name, version: res.data[0].tag_name, release_id: res.data[0].id })
                            }
                            this._packagesAllVersions.push({ package: pkg.name, version: res.data.map((x: any) => ({ release_id: x.id, release_version: x.tag_name })) })
                        })
                        .catch((err: AxiosError) => console.log(err))

                case 'bitbucket':
                    const { bitbucketurl } = this.BitbucketAPIURL(user, repo)
                    return Axios
                        .get(bitbucketurl)
                        .then((res: AxiosResponse) => {
                            if (res.data.values[0] !== undefined) {
                                const { date, month, year } = getFullDateFunction(res.data.values[0].created_on)
                                this._packagesLatest.push({ package: pkg.name, version: `${year}-${month + 1}${date}`, release_id: 0, downloadLink: res.data.values[0].links.self.href })
                            }
                            this._packagesAllVersions.push({
                                package: pkg.name, version: res.data.values.map((x: any) => {
                                    const { date, month, year } = getFullDateFunction(x.created_on)
                                    return { release_id: 0, release_version: `${year}-${month}${date}`, downloadLink: x.links.self.href }
                                })
                            })
                        })
                        .catch((err: AxiosError) => console.log(err))

                default:
                    return
            }
        })
    }

    private GitHubAPIURL = (user: string, repo: string, isLatest: boolean, version?: string | number | undefined): { giturl: string, config: AxiosRequestConfig } => {
        return { giturl: `https://api.github.com/repos/${user}/${repo}/releases${version ? `/${version}` : ""}${isLatest ? `/latest` : ""}`, config: { headers: { Authorization: `Token ${GITHUB_TOKEN as string}` } } }
    }

    private BitbucketAPIURL = (user: string, repo: string): { bitbucketurl: string, config?: AxiosRequestConfig } => {
        return { bitbucketurl: `https://api.bitbucket.org/2.0/repositories/${user}/${repo}/downloads` }
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
                const specificVersion = this._packagesAllVersions.map(pkg => {
                    if (pkg.package === `${user}/${repo}`) {
                        const foundVersion = pkg.version.find(pkgV => pkgV.release_version == version)
                        return foundVersion
                    }
                    return null
                }).filter(Boolean)

                const { giturl, config } = this.GitHubAPIURL(user, repo, false, specificVersion[0]?.release_id)

                Axios.get(giturl, config)
                    .then((apiData: AxiosResponse) => {
                        res.status(200).send({ version: specificVersion, message: "SPECIFIC VERSION RELEASE", data: apiData.data })
                    })
                    .catch((err: AxiosError) => res.status(400).send({ error: err, message: "Error" }))
            } else {
                const latestVersion = this._packagesLatest.find(pkg => pkg.package === `${user}/${repo}` && pkg.version)
                const { giturl, config } = this.GitHubAPIURL(user, repo, true)
                Axios.get(giturl, config)
                    .then((apiData: AxiosResponse) => {
                        res.status(200).send({ version: latestVersion, message: "LATEST RELEASE", data: apiData.data })
                    })
                    .catch((err: AxiosError) => res.status(400).send({ error: err, message: "Error" }))
            }

        }
    }
}

export default GitHubAPIController