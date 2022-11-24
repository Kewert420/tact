import rawGrammar from './grammar.ohm-bundle';
import { ASTNode, ASTProgram, createNode } from '../ast/ast';


// Semantics
const semantics = rawGrammar.createSemantics();

// Resolve program
semantics.addOperation<ASTNode>('resolve_program', {
    Program(arg0) {
        return createNode({
            kind: 'program',
            entries: arg0.children.map((v) => v.resolve_program_item())
        });
    },
});

// Resolve program items
semantics.addOperation<ASTNode>('resolve_program_item', {
    Struct(arg0, arg1, arg2, arg3, arg4) {
        return createNode({
            kind: 'def_struct',
            name: arg1.sourceString,
            fields: arg3.children.map((v) => v.resolve_declaration())
        })
    },
    Contract(arg0, arg1, arg2, arg3, arg4) {
        return createNode({
            kind: 'def_contract',
            name: arg1.sourceString,
            declarations: arg3.children.map((v) => v.resolve_declaration())
        })
    },
});

// Struct and class declarations
semantics.addOperation<ASTNode>('resolve_declaration', {
    Field(arg0, arg1, arg2, arg3, arg4) {
        return createNode({
            kind: 'def_field',
            name: arg1.sourceString,
            type: arg3.sourceString
        })
    },
    FunctionArg(arg0, arg1, arg2) {
        return createNode({
            kind: 'def_argument',
            name: arg0.sourceString,
            type: arg2.sourceString
        })
    },
    Function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        return createNode({
            kind: 'def_function',
            name: arg1.sourceString,
            return: arg6.sourceString,
            args: arg3.asIteration().children.map((v: any) => v.resolve_declaration()),
            statements: arg8.children.map((v: any) => v.resolve_statement()),
        })
    },
});

// Statements
semantics.addOperation<ASTNode>('resolve_statement', {
    StatementLet(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        return createNode({
            kind: 'let',
            name: arg1.sourceString,
            type: arg3.sourceString,
            expression: arg5.resolve_expression()
        })
    },
    StatementReturn(arg0, arg1, arg2) {
        return createNode({
            kind: 'return',
            expression: arg1.resolve_expression()
        })
    },
});

// Expressions
semantics.addOperation<ASTNode>('resolve_expression', {
    integerLiteral(n) {
        // Parses dec-based integer and hex-based integers
        return createNode({ kind: 'number', value: BigInt(n.sourceString) });
    },
    id(arg0, arg1) {
        return createNode({ kind: 'id', value: arg0.sourceString + arg1.sourceString });
    },
    nullLiteral(arg0) {
        return createNode({ kind: 'null' });
    },
    boolLiteral(arg0) {
        return createNode({ kind: 'boolean', value: arg0.sourceString === 'true' });
    },
    ExpressionAdd_add(arg0, arg1, arg2) {
        return createNode({ kind: 'op_binary', op: '+', left: arg0.resolve_expression(), right: arg2.resolve_expression() });
    },
    ExpressionAdd_sub(arg0, arg1, arg2) {
        return createNode({ kind: 'op_binary', op: '-', left: arg0.resolve_expression(), right: arg2.resolve_expression() });
    },
    ExpressionMul_div(arg0, arg1, arg2) {
        return createNode({ kind: 'op_binary', op: '/', left: arg0.resolve_expression(), right: arg2.resolve_expression() });
    },
    ExpressionMul_mul(arg0, arg1, arg2) {
        return createNode({ kind: 'op_binary', op: '*', left: arg0.resolve_expression(), right: arg2.resolve_expression() });
    },
    ExpressionField(arg0, arg1, arg2) {
        return createNode({ kind: 'op_field', src: arg0.resolve_expression(), key: arg2.sourceString });
    },
    ExpressionCall(arg0, arg1, arg2, arg3, arg4, arg5) {
        return createNode({ kind: 'op_call', src: arg0.resolve_expression(), key: arg2.sourceString, args: arg4.asIteration().children.map((v: any) => v.resolve_expression()) });
    },
});

export function parse(src: string): ASTProgram {
    let matchResult = rawGrammar.match(src);
    if (matchResult.failed()) {
        throw new Error(matchResult.message);
    }
    let res = semantics(matchResult).resolve_program();
    return res;
}