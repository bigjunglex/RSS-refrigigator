import fs from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { cursorTo } from "node:readline";


const CONFIG = '.gatorconfig.json'

export type Config = {
    dbUrl: string;
    currentUserName: string;
}

const getConfigFilePath = ():string => path.join(homedir(), CONFIG) 
const writeConfig = (config:Config):void => fs.writeFileSync(getConfigFilePath(), JSON.stringify(config))


function validateConfig(rawConfig:any):Config {
    const cfg = rawConfig
    const keys = Object.keys(cfg)||[]

    if (
        typeof cfg === 'object'
        && keys.includes('currentUserName')
        && keys.includes('dbUrl')
        && typeof cfg['currentUserName'] === 'string'
        && typeof cfg['dbUrl'] === 'string'
    ) {
        return cfg as Config
    }

    throw Error(`[INVALID CONFIG]: ${rawConfig} is not vaild gator config`)

}

export function setUser(user:string):void {
    const cfg = readConfig();
    writeConfig({...cfg, currentUserName: user})
}

export function readConfig():Config {
    let out= {} as Config;
    try {
        const raw = JSON.parse(fs.readFileSync(getConfigFilePath(), {encoding: 'utf-8'}))
        out = validateConfig(raw)
    } catch (error) {
        console.error(`Failed to read config ${error}`)
    }
    return out
}

