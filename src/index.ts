import { registerCommand, runCommand, type CommnandRegistry } from "./commands/commands";
import { hadleLogin, handleRegister, handleReset, handleUsers, handleAgg, handleAddFeed } from "./commands/cmd-handlers";


(async function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry:CommnandRegistry = {};
    
    registerCommand(registry , 'login', hadleLogin);
    registerCommand(registry, 'register', handleRegister)
    registerCommand(registry, 'reset', handleReset)
    registerCommand(registry, 'users', handleUsers)
    registerCommand(registry, 'agg', handleAgg)
    registerCommand(registry, 'addfeed', handleAddFeed)

    try {
        await runCommand(registry, cmd, ...args)
    } catch (error:any) {
        console.error('[COMAND]: ', error.message)
        process.exit(1)
    }

    /**
     * Exits before drizzle followthrough
     * fix async exit without setTimeout 
     *  */ 
    setTimeout(() => process.exit(0), 1000)
})()
