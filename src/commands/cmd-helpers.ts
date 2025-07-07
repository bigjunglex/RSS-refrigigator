import type { Feed } from "src/lib/db/queries/feed";
import type { User } from "src/lib/db/queries/users";

export function printFeed(feed:Feed, user: User):void {
    const a = `\nAdded feed: \n--${feed.name} : ${feed.url} `;
    const b = `\nUser: \n--name: ${user.name} \n--id: ${user.id}`;

    console.log(a, b)
}