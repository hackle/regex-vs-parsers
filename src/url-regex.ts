import { Mode } from "./modes";

const regex = /^ $/;

export function parseIt(url: string): Mode | null {
    const match = regex.exec(url);
    if (!match) return null;

    const [, id, clone ] = match;

    if (clone) return { mode: 'clone', id: id };
    if (id != null) return { mode: 'edit', id: id };
    return { mode: 'create' };
}