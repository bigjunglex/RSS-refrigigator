import { describe, expect, it } from "vitest"
import { promisePool } from "src/lib/feedHelp"
import { lengthObserver, timeout } from "../utils"

describe('[UNIT]: promise pool', () => {

    it('stays in concurrency limit', async () => {
        const limit = 2;
        let [max, current] = [0, 0];
        
        const callback = async ():Promise<void> => {
            current++
            max = Math.max(max, current);
            await timeout()
            current--
        }

        const promises = Array(5).fill(0).map(() => callback);
        await promisePool(promises, limit)

        expect(max).toBe(limit)
    })

    it('right order of execution', async () => {
        const target = [1,2,3,4,5]
        const out:number[] = [];

        const callback = async (n:number):Promise<void> => {
            out.push(n);
            await timeout();
        }

        const promises = target.map((number) => () => callback(number))
        await promisePool(promises, 1)
        await lengthObserver(out, target.length)

        expect(out).toEqual(target)
    })

})