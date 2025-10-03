import fs from "node:fs";
import { vi } from "vitest";


export function fetchMock(data:string) {
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(data),
        json: () => Promise.resolve(JSON.parse(data))
    } as Response)
}

/**
 *  Returns promise with somewhat random timeout
 * @param big sets longer multiplier
 * @returns 
 */
export function timeout(big = false):Promise<void> {
    const multi = big ? 1000 : 100
    return new Promise(resolve => setTimeout(resolve, Math.random() * multi))
}


export function lengthObserver(arr: any[], limit: number): Promise<void> {
    return new Promise(resolve => {
        if (arr.length >= limit) { resolve(); return }

        const timer = setInterval(() => {
            if (arr.length >= limit) {
                clearInterval(timer);
                resolve();
            }
        }, 100)
    })

}

/**
 * setsup env with env test values
 */
export function setupEnv(path: fs.PathLike) {
    const env = fs.readFileSync(path).toString();
    const out = env.split('\n').reduce((acc, entry:string) => {
        const [key, val] = entry.split('=')
        acc[key] = val;
        return acc
    }, {} as {[key:string]: string})
    return out

    //ci fix
}

export function setupTestDB(original: fs.PathLike) {
    const destination = original
        .toString()
        .replace('test.db', 'TEMP.db')
        .replace('file:', '');
    fs.copyFileSync(original.toString().replace('file:', ''), destination);
    fs.chmodSync(destination, 0o666)
    return `file:${destination}`
}

export function clearTestDB(path: fs.PathLike) {
    path = path.toString().replace('file:', '')
    fs.unlinkSync(path)    
}