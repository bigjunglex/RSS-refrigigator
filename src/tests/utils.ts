import { vi } from "vitest";

export function fetchMock(data:string) {
    vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(data),
        json: () => Promise.resolve(JSON.parse(data))
    } as Response)
}