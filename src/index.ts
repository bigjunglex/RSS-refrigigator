import { registerCommand, runCommand, type CommnandRegistry } from "./commands/commands";
import { hadlerLogin, handlerRegister } from "./commands/cmd-handlers";

(async function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry:CommnandRegistry = {};
    registerCommand(registry , 'login', hadlerLogin);
    registerCommand(registry, 'register', handlerRegister)
    try {
        await runCommand(registry, cmd, ...args)
    } catch (error:any) {
        console.error('[COMAND]: ', error.message)
        process.exit(1)
    }
    setTimeout(() => process.exit(0), 2000)
})()
