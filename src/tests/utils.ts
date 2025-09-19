import { resolve } from "node:path";
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