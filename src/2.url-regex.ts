import { Mode } from "./0.modes";

const regex = /^ $/;

export function parseIt(url: string): Mode | null {
    const match = regex.exec(url);
    if (!match) return null;

    const [ all, id, clone ] = match;

    if (clone === 'clone') return { mode: 'clone', id: id };
    if (id != null) return { mode: 'edit', id: id };
    return { mode: 'create' };
}