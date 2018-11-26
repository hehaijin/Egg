
/**
 * parses the whole program into a structure {expr: expression, rest: program}
 * it can receive partial expression like  "x,10)"
 * @param program
 * @returns {{expr, rest}}
 */
function parseExpression(program){
    program= skipSpace(program);
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
 * this is same as string.trimStart()?
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
    if(program[0] !== "("){
        return {expr, rest: program};
    }
    program=  skipSpace(program.substring(1));
    expr= {type: "apply", operator:expr, args: []};
    while(program[0] != ")"){
        //console.log(program)
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