import { ASTRef, throwError } from "../ast/ast";
import { CompilerContext } from "../ast/context";
import { WriterContext } from "../generator/Writer";
import { getType } from "../types/resolveTypeDescriptors";
import { TypeRef } from "../types/types";

export type AbiFunction = {
    name: string;
    resolve: (ctx: CompilerContext, args: (TypeRef | null)[], ref: ASTRef) => TypeRef | null;
    generate: (ctx: WriterContext, args: (TypeRef | null)[], resolved: string[], ref: ASTRef) => string;
}

export const ABIFunctions: { [key: string]: AbiFunction } = {
    dump: {
        name: 'dump',
        resolve: (ctx, args, ref) => {
            if (args.length !== 1) {
                throwError('dump expects 1 argument', ref);
            }
            return null;
        },
        generate: (ctx, args, resolved, ref) => {
            return `${resolved[0]}~dump()`;
        }
    },
    pack_cell: {
        name: 'pack_cell',
        resolve: (ctx, args, ref) => {
            if (args.length !== 1) {
                throwError('pack_cell expects 1 argument', ref);
            }
            if (args[0] === null || args[0].kind !== 'ref' || args[0].optional) {
                throwError('pack_cell expects a direct type', ref);
            }
            let tp = getType(ctx, args[0].name);
            if (tp.kind !== 'struct') {
                throwError('pack_cell expects a struct type', ref);
            }
            return { kind: 'ref', name: 'Cell', optional: false };
        },
        generate: (ctx, args, resolved, ref) => {
            if (args.length !== 1) {
                throwError('pack_cell expects 1 argument', ref);
            }
            if (args[0] === null || args[0].kind !== 'ref' || args[0].optional) {
                throwError('pack_cell expects a direct type', ref);
            }
            let tp = getType(ctx.ctx, args[0].name);
            if (tp.kind !== 'struct') {
                throwError('pack_cell expects a struct type', ref);
            }
            ctx.used(`__gen_writecell_${args[0].name}`);
            return `__gen_writecell_${args[0].name}(${resolved.join(', ')})`;
        }
    },
    pack_slice: {
        name: 'pack_slice',
        resolve: (ctx, args, ref) => {
            if (args.length !== 1) {
                throwError('pack_slice expects 1 argument', ref);
            }
            if (args[0] === null || args[0].kind !== 'ref' || args[0].optional) {
                throwError('pack_slice expects a direct type', ref);
            }
            let tp = getType(ctx, args[0].name);
            if (tp.kind !== 'struct') {
                throwError('pack_slice expects a struct type', ref);
            }
            return { kind: 'ref', name: 'Slice', optional: false };
        },
        generate: (ctx, args, resolved, ref) => {
            if (args.length !== 1) {
                throwError('pack_slice expects 1 argument', ref);
            }
            if (args[0] === null || args[0].kind !== 'ref' || args[0].optional) {
                throwError('pack_slice expects a direct type', ref);
            }
            let tp = getType(ctx.ctx, args[0].name);
            if (tp.kind !== 'struct') {
                throwError('pack_slice expects a struct type', ref);
            }
            ctx.used(`__gen_writeslice_${args[0].name}`);
            return `__gen_writeslice_${args[0].name}(${resolved.join(', ')})`;
        }
    }
};

export const MapFunctions: { [key: string]: AbiFunction } = {
    set: {
        name: 'set',
        resolve(ctx, args, ref) {
            if (args.length !== 3) {
                throwError('set expects 2 argument', ref); // Ignore self
            }
            if (!args[0] || args[0].kind !== 'map') {
                throwError('set expects a map as first argument', ref);
            }
            if (args[1] === null || args[1].kind !== 'ref' || args[1].optional) {
                throwError('set expects a direct type as second argument', ref);
            }
            // TODO: Check values
            return null;
        },
        generate: (ctx, args, resolved, ref) => {
            if (args.length !== 3) {
                throwError('set expects 2 argument', ref); // Ignore self
            }
            if (!args[0] || args[0].kind !== 'map') {
                throwError('set expects a map as first argument', ref);
            }
            if (args[1] === null || args[1].kind !== 'ref' || args[1].optional) {
                throwError('set expects a direct type as second argument', ref);
            }

            ctx.used(`__tact_dict_set_int_int`);
            return `__tact_dict_set_int_int(${resolved[0]}, 257, ${resolved[1]}, ${resolved[2]}, 257)`;
        }
    }
}