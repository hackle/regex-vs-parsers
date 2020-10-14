export type Create = { mode: 'create' };
export type EditOrClone = { mode: 'edit' | 'clone', id: string };

export type Mode = Create | EditOrClone;

// why not this? 
// type Mode = { mode: 'create' | 'edit' | 'clone', id: number }