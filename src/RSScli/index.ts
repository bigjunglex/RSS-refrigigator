import { handleError } from "./commands/cmd-handlers.js";
import { runCommand } from "./commands/commands.js";
import { initRegistry } from "./commands/registry.js";


async function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry = initRegistry()
    await runCommand(registry, cmd, ...args).catch(handleError)
    process.exit(0)
}

main();
