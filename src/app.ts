import * as express from 'express'
import { Application } from 'express'

class App {
    public app: Application
    public port: string | number

    constructor(appInit: { port: string | number, middleware: any; controller: any }) {
        this.app = express.default()
        this.port = appInit.port

        this.middlewares(appInit.middleware)
        this.routes(appInit.controller)

        this.assets()
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {
        controllers.forEach(controller => {
            this.app.use(controller.route, controller.endpoint.router)
        })
    }

    private assets() {
        this.app.use(express.static('public'))
        this.app.use(express.static('views'))
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`)
        })
    }
}

export default App;