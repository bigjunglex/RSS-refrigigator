export type CommandHandler = (cmd:string, ...args: string[]) => Promise<void>;
export type CommnandRegistry = { [k:string]: CommandHandler };

export function registerCommand(registry: CommnandRegistry, cmd:string, handler: CommandHandler) {
    if (registry.hasOwnProperty(cmd)) throw Error(`Command: ${cmd} already set`);
    registry[cmd] = handler;
}


export async function runCommand(registry: CommnandRegistry, cmd:string, ...args: string[]) {
    if (!registry.hasOwnProperty(cmd)) throw Error(`Command: ${cmd} is not registred`);
    await registry[cmd](cmd, ...args);
}