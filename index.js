'use strict'
/* In the Egg language, everything is a expression
    Expression have a type property.
    3 types of expression. their types are: value, word, apply.
    Ev: {type:"value", value: xx}   for string and number literal.
    Ew: {type: "word", name: xx}    for variables/identifiers
    Ea: {type: "apply", operator: Ew, args:[Ev/Ew]}  for functions and operators. E means expression.
 */





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



function evaluate(expr, env){
    switch(expr.type){
        case "value":
            return expr. value;
        case "word":
            if(expr.name in env){
                return env[expr.name];
            }
            else
                throw new ReferenceError("undefined variable: "+ expr.name);
        case "apply":
            if(expr.operator.type === "word" && expr.operator.name in specialForms)
                return specialForms[expr.operator.name](expr.args,env);
            var op= evaluate(expr.operator, env);
            if(typeof op !== "function")
                throw new TypeError("applying a non function");
            return op.apply(null, expr.args.map( arg => evaluate(arg,env) ));
    }
}

var specialForms= Object.create(null);

specialForms["if"]= function(args,env){
    if(args.length !== 3) throw new SyntaxError("Bad number of arguments to if");
    if(evaluate(args[0],env) === true) return evaluate(args[1],env);
    else return evaluate(args[2], env);
}

specialForms["while"]= function(args,env){
    if(args.length !== 2){
        throw new Error("bad number of arguments to while");
    }
    while(evaluate(args[0],env) !== false)
    {
        evaluate(args[1],env);
    }
    return false;
}

specialForms["define"] = function(args,env) {
    if(args.length !== 2){
        throw new Error("bad number of arguments to define");
    }
    var value= evaluate(args[1],env);
    env[args[0].name]= value;
    return value;
}

specialForms["do"] = function(args,env) {
    var result=0;
    for(var i in args)
    {
        result= evaluate(args[i], env);
    }
    return result;
}


var topEnv= Object.create(null);
topEnv["true"] = true;
topEnv["false"]= false;
["+","-","*","/","==","<",">"].forEach(op=> {
    topEnv[op] = new Function("a,b", "return a "+ op+ " b;");
});
topEnv["print"]= function(value){
    console.log(value);
    return value;
}

function run(program)
{
    var env= Object.create(topEnv);
    return evaluate(parseR(program), env);
}


// " must be excaped in string.
var p1= "+(10,10)";
var p2= "define(x,10)"
var p3= "do(define(x,10),if(>(x,5),print(\"larger\"), print(\"small\")))"
var p4= "\"10\"";
var p5="print(\"test\")"
var p6= "if(>(10,5),print(\"larger\"), print(\"small\"))"

//var p5= "x"
//console.log(parseR(p6));
run(p3)

