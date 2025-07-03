import { registerCommand, runCommand, type CommnandRegistry } from "./commands/commands";
import { hadlerLogin, handlerRegister, handleReset, handleUsers } from "./commands/cmd-handlers";

(async function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry:CommnandRegistry = {};
    
    registerCommand(registry , 'login', hadlerLogin);
    registerCommand(registry, 'register', handlerRegister)
    registerCommand(registry, 'reset', handleReset)
    registerCommand(registry, 'users', handleUsers)

    try {
        await runCommand(registry, cmd, ...args)
    } catch (error:any) {
        console.error('[COMAND]: ', error.message)
        process.exit(1)
    }
    // fix async exit without 
    setTimeout(() => process.exit(0), 1000)
})()
