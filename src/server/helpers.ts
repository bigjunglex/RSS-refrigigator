import type { User } from "src/lib/db/queries/users"

export function formatUserRegResponse(user:User) {
    return {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        name: user.name
    }
}
