'use strict'

/**
 *
 * @param program
 * @returns {{expr, rest}}
 */
function parseExpression(program){
    var program= skipSpace(program);
    var match, expr;
    //
    if( match = /^"([^"]*)"/.exec(program) ){
        expr= {type:"value", value: match[1]};
    }
    else if ( match = /^\d+\b/.exec(program)) {
        expr= {type:"value", value: Number(match[0])};
    }
    else if (match = /^[^\s(),"]+/.exec(program)){
        expr= {type:"word",value: match[0]}
    }
    else throw new SyntaxError("unexpected syntax "+ program);
    return parseApply(expr, program.slice(match[0].length));
}

/**
 * removes leading space from input.
 * @param string
 * @returns {*}
 */
function skipSpace(string){
    var first= string.search(/\S/);  // looking for first non space character.
    if(first === -1) return "";      // so no non-space character exist.
    return string.substring(first);
}

/**
 * parses for Apply construct.
 * @param expr
 * @param program
 * @returns {*}
 */
function parseApply(expr, program){
    program= skipSpace(program);
    if(program[0] !== "("){
        return {expr, rest: program};
    }
    program=  skipSpace(program.substring(1));
    expr= {type: "apply", operator:expr, args: []};
    while(program[0] != ")"){
        var arg= parseExpression(program);
        expr.args.push(arg.expr);
        program= skipSpace(arg.rest);
        if(program[0]=== ","){
            program= program.substring(1);
        }
        else if(program[0] != ")" ){
            throw new SyntaxError("Expected ',' or ')'");
        }

    }
    return parseApply(expr, program.substring(1));
}


function parse(program){
    var result= parseExpression(program);
    if(skipSpace(result.rest).length > 0 ){
        throw new SyntaxError("unexpedted text after program");
    }
    return result.expr;
}




function evaluate(expr, env){
    switch(expr.type){
        case "value":
            return expr. value;
        case "word":
            if(expr.name in env)
                return env[expr.name];
            else
                throw new ReferenceError("undefined variable: "+ expr.name);
        case "apply":
            if(expr.operator.type === "word" && expr.operator.name in specialForms)
                return specialForms[expr.operator.name](expr.args.env);
            var op= evaluate(expr.operator, env);
            if(typeof op !== "function")
                throw new TypeError("applying a non function");
            return op.apply(null, expr.args.map( arg => evaluate(arg,env) ));
    }
}

var specialForms= Object.create(null);





var p1= "+(a,10)";
var p2= "define(x,10)"
console.log(parseExpression(p2));


