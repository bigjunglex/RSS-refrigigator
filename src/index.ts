import { setUser, readConfig, type Config } from "./config"

const BASE_CONFIG = { dbUrl:'postgres://example' } as Config; 

(function main() {
    setUser(BASE_CONFIG)
    const out = readConfig()
    console.log(out)
})()
