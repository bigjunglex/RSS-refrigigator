import { runCommand } from "./commands/commands";
import { initRegistry } from "./commands/registry";


async function main() {
    const [cmd, ...args] = process.argv.slice(2)
    const registry = initRegistry()

    try {
        await runCommand(registry, cmd, ...args)
        process.exit(0)
    } catch (error:any) {
        console.error('[COMAND]: ', error.message)
        process.exit(1)
    }
}

main();
