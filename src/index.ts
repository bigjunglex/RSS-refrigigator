import { setUser, readConfig, type Config } from "./config"
import { registerCommand, runCommand, type CommnandRegistry } from "./commands";

function hadlerLogin(cmd:string, ...args: string[]) {
    const username = args.join('').replace(/\s/g, '');
    if (args.length === 0) throw Error('[LOGIN]: expected argument username');
    setUser(username)
    console.log('[CONFIG]: user has been set to %s', username)
}

(function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry:CommnandRegistry = {};
    registerCommand(registry , 'login', hadlerLogin);
    runCommand(registry, cmd, ...args)
    console.log(readConfig())
})()

