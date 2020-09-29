import { Mode } from "./modes";

const regex = {
    create:     /\/book\/?$/i,
    edit:       /\/book\/(\d+)\/?$/i,
    clone:      /\/book\/(\d+)\/(clone)\/?$/i,
    catchAll:   /\/book(?:(?:\/(\d+))(?:\/(clone))?)?\/?$/i
};

export function parseIt(url: string): Mode | null {
    const match = regex.catchAll.exec(url);
    if (!match) return null;

    const [, id, clone ] = match;

    if (clone) return { mode: 'clone', id: id };
    if (id != null) return { mode: 'edit', id: id };
    return { mode: 'create' };
}