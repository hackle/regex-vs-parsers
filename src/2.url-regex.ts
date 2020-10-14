import { Mode } from "./0.modes";

const regex = {
    create:     /^\/book$/i,
    edit:       /^\/book(?:\/(\d+))?$/i,
    clone:      /^\/book\/(\d+)\/(clone)$/i,
    catchAll:   /^\/book(?:(?:\/(\d+))(?:\/(clone))?)?$/i
};

export function parseIt(url: string): Mode | null {
    const match = regex.catchAll.exec(url);
    if (!match) return null;

    // at 0 is the whole string is matches
    const [ , id, clone ] = match;

    if (clone === 'clone') return { mode: 'clone', id: id };
    if (id != null) return { mode: 'edit', id: id };
    return { mode: 'create' };
}