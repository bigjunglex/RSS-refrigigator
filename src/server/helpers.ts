import type { User } from "../lib/db/queries/users.js"

export function formatUserRegResponse(user:User) {
    return {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        name: user.name
    }
}
