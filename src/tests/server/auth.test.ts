import { describe, it, expect} from "vitest";
import { Request } from "express";
import { getBearerToken, makeJWT, validateJWT } from "src/server/auth";


describe("[UNIT] - [AUTH]: JWT check", () => {
    const ids = [
        'DUNGONESLICERMUSHROOM',
        'STARFLIGHTUNDERGROUND',
        '1337shadowST3/7'
    ]
    const secret = 'SkeletonSlimeSurferSamsSecret'
    const time = 100000000
    const jwts = ids.map((id) => makeJWT(id, time, secret))

    it("validates JWTS", () => {
        for (let i = 0; i < jwts.length; i++) {
            const payload = validateJWT(jwts[i], secret)
            expect(payload).toBe(ids[i])
        }
    })

    it("throws on invalid", () => {
        const newSecret = 'TrustedTombTomagawkTomsTrick'
        for (let i = 0; i < jwts.length; i++) {
            const call = () => validateJWT(jwts[i], newSecret)
            expect(call).toThrowError()
        }
    })
})

describe('[UNIT] -[AUTH]: token extraction', () => {
    const token = 'TokyoToken'
    const req:Pick<Request, 'headers'> = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const invals = [{}, {headers: {}}, {headers: {authorization: token}}]

    it('valid header', () => {
        const check = getBearerToken(req as Request)
        expect(check).toBe(token)
    })

    it('throws on invalid', () => {
        for (const t of invals) {
            const call = () => getBearerToken(t as Request);
            expect(call).toThrowError('[AUTH]: Invalid Auth Token')
        }
    })
})