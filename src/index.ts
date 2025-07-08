import { registerCommand, runCommand, type CommnandRegistry } from "./commands/commands";
import { hadleLogin, handleRegister, handleReset, handleUsers, handleAgg, handleAddFeed, handleFeeds, handleFollow, handleFollowing, handleUnfollow } from "./commands/cmd-handlers";
import { isLogged } from "./commands/cmd-helpers";

(async function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry:CommnandRegistry = {};
    
    registerCommand(registry , 'login', hadleLogin)
    registerCommand(registry, 'register', handleRegister)
    registerCommand(registry, 'reset', handleReset)
    registerCommand(registry, 'agg', handleAgg)
    registerCommand(registry, 'feeds', handleFeeds)
    registerCommand(registry, 'users', isLogged(handleUsers))
    registerCommand(registry, 'addfeed', isLogged(handleAddFeed))
    registerCommand(registry, 'follow', isLogged(handleFollow))
    registerCommand(registry, 'following', isLogged(handleFollowing))
    registerCommand(registry, 'unfollow', isLogged(handleUnfollow))

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
