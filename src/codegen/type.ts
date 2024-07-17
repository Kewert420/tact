import { CompilerContext } from "../context";
import { TypeDescription, TypeRef } from "../types/types";
import { getType } from "../types/resolveDescriptors";
import { FuncType, UNIT_TYPE } from "../func/syntax";
import { Type } from "../func/syntaxConstructors";

/**
 * Unpacks string representation of a user-defined Tact type from its type description.
 * The generated string represents an identifier avialable in the current scope.
 */
export function resolveFuncTypeUnpack(
    ctx: CompilerContext,
    descriptor: TypeRef | TypeDescription | string,
    name: string,
    optional: boolean = false,
    usePartialFields: boolean = false,
): string {
    // String
    if (typeof descriptor === "string") {
        return resolveFuncTypeUnpack(
            ctx,
            getType(ctx, descriptor),
            name,
            false,
            usePartialFields,
        );
    }

    // TypeRef
    if (descriptor.kind === "ref") {
        return resolveFuncTypeUnpack(
            ctx,
            getType(ctx, descriptor.name),
            name,
            descriptor.optional,
            usePartialFields,
        );
    }
    if (descriptor.kind === "map") {
        return name;
    }
    if (descriptor.kind === "ref_bounced") {
        return resolveFuncTypeUnpack(
            ctx,
            getType(ctx, descriptor.name),
            name,
            false,
            true,
        );
    }
    if (descriptor.kind === "void") {
        throw Error(`Void type is not allowed in function arguments: ${name}`);
    }

    // TypeDescription
    if (descriptor.kind === "primitive_type_decl") {
        return name;
    } else if (descriptor.kind === "struct") {
        const fieldsToUse = usePartialFields
            ? descriptor.fields.slice(0, descriptor.partialFieldCount)
            : descriptor.fields;
        if (optional || fieldsToUse.length === 0) {
            return name;
        } else {
            return (
                "(" +
                fieldsToUse
                    .map((v) =>
                        resolveFuncTypeUnpack(
                            ctx,
                            v.type,
                            name + `'` + v.name,
                            false,
                            usePartialFields,
                        ),
                    )
                    .join(", ") +
                ")"
            );
        }
    } else if (descriptor.kind === "contract") {
        if (optional || descriptor.fields.length === 0) {
            return name;
        } else {
            return (
                "(" +
                descriptor.fields
                    .map((v) =>
                        resolveFuncTypeUnpack(
                            ctx,
                            v.type,
                            name + `'` + v.name,
                            false,
                            usePartialFields,
                        ),
                    )
                    .join(", ") +
                ")"
            );
        }
    }

    // Unreachable
    throw Error(`Unknown type: ${descriptor.kind}`);
}

/**
 * Generates Func type from the Tact type.
 */
export function resolveFuncType(
    ctx: CompilerContext,
    descriptor: TypeRef | TypeDescription | string,
    optional: boolean = false,
    usePartialFields: boolean = false,
): FuncType {
    // String
    if (typeof descriptor === "string") {
        return resolveFuncType(
            ctx,
            getType(ctx, descriptor),
            false,
            usePartialFields,
        );
    }

    // TypeRef
    if (descriptor.kind === "ref") {
        return resolveFuncType(
            ctx,
            getType(ctx, descriptor.name),
            descriptor.optional,
            usePartialFields,
        );
    }
    if (descriptor.kind === "map") {
        return Type.cell();
    }
    if (descriptor.kind === "ref_bounced") {
        return resolveFuncType(ctx, getType(ctx, descriptor.name), false, true);
    }
    if (descriptor.kind === "void") {
        return UNIT_TYPE;
    }

    // TypeDescription
    if (descriptor.kind === "primitive_type_decl") {
        if (descriptor.name === "Int") {
            return Type.int();
        } else if (descriptor.name === "Bool") {
            return Type.int();
        } else if (descriptor.name === "Slice") {
            return Type.slice();
        } else if (descriptor.name === "Cell") {
            return Type.cell();
        } else if (descriptor.name === "Builder") {
            return Type.builder();
        } else if (descriptor.name === "Address") {
            return Type.slice();
        } else if (descriptor.name === "String") {
            return Type.slice();
        } else if (descriptor.name === "StringBuilder") {
            return Type.tuple();
        } else {
            throw Error(`Unknown primitive type: ${descriptor.name}`);
        }
    } else if (descriptor.kind === "struct") {
        const fieldsToUse = usePartialFields
            ? descriptor.fields.slice(0, descriptor.partialFieldCount)
            : descriptor.fields;
        if (optional || fieldsToUse.length === 0) {
            return Type.tuple();
        } else {
            return Type.tensor(
                ...fieldsToUse.map((v) =>
                    resolveFuncType(ctx, v.type, false, usePartialFields),
                ),
            );
        }
    } else if (descriptor.kind === "contract") {
        if (optional || descriptor.fields.length === 0) {
            return Type.tuple();
        } else {
            return Type.tensor(
                ...descriptor.fields.map((v) =>
                    resolveFuncType(ctx, v.type, false, usePartialFields),
                ),
            );
        }
    }

    // Unreachable
    throw Error(`Unknown type: ${descriptor.kind}`);
}
