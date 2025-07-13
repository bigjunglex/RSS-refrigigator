import { handleError } from "./commands/cmd-handlers";
import { runCommand } from "./commands/commands";
import { initRegistry } from "./commands/registry";


async function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry = initRegistry()
    console.log(process.stdin.isTTY)

    await runCommand(registry, cmd, ...args).catch(handleError)
    process.exit(0)
}

main();
