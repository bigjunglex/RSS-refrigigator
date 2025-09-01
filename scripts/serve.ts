import { ChildProcess, spawn } from "child_process";


const events:NodeJS.Signals[] = [
    'SIGTERM',
    'SIGINT',
    'SIGQUIT'
]

const commands:[string, string[]][] = [
    ['npm', ['run', 'dev-server']],
    ['npm', ['run', 'dev-client']],
    ['npm', ['run', 'start', 'agg', '1h']]
]

const killSlaves = (slaves:ChildProcess[]) => slaves.forEach(s => s.kill())
const spawnSlave = (cmd:string, args:string[]):ChildProcess => {
    const msg = '👹: '
    console.log(msg, cmd, args)
    const slave = spawn(cmd, args.flat(), { shell:true })
    slave.stdout.on('data', (data) => process.stdout.write(data))
    slave.stderr.on('data', (data) => process.stderr.write(data))
    slave.on('error', (error) => console.log(msg, cmd, args, error))
    slave.on('exit', (code) => {
        if (code !== 0) {
            console.error(msg, cmd, args, 'exit with', code)
        }
        console.log(msg, cmd, args, 'shut down')
    })

    return slave
}

const slaves = commands.map(([cmd, args]) => spawnSlave(cmd, args))
for (const event of events) {
    process.on(event, () => killSlaves(slaves))
}