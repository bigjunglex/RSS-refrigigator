import { hadleLogin, handleAddFeed, handleAgg, handleBrowse, handleFeeds, handleFollow, handleFollowing, handleRegister, handleReset, handleSearch, handleUnfollow, handleUsers } from "./cmd-handlers";
import { isLogged } from "./cmd-helpers";
import { type CommnandRegistry, registerCommand } from "./commands";

export function initRegistry():CommnandRegistry {
    const registry:CommnandRegistry = {};
    
    registerCommand(registry, 'login', hadleLogin)
    registerCommand(registry, 'register', handleRegister)
    registerCommand(registry, 'gigasecretmegacode', handleReset)
    registerCommand(registry, 'agg', handleAgg)
    registerCommand(registry, 'feeds', handleFeeds)
    registerCommand(registry, 'users', isLogged(handleUsers))
    registerCommand(registry, 'addfeed', isLogged(handleAddFeed))
    registerCommand(registry, 'follow', isLogged(handleFollow))
    registerCommand(registry, 'following', isLogged(handleFollowing))
    registerCommand(registry, 'unfollow', isLogged(handleUnfollow))
    registerCommand(registry, 'browse', isLogged(handleBrowse))
    registerCommand(registry, 'search', isLogged(handleSearch))

    return registry
}