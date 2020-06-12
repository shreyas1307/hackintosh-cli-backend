export type GithubPackageLatest = {
    package: string,
    version: number | string,
    release_id: string | number
}
export type GithubPackageAllVersions = {
    package: string,
    version: {
        release_id: string | number,
        release_version: number | string
    }[]
}