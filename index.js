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


/**
 * parse the program Recursively.
 * @param program
 * @returns {*}
 */
function parseR(program)
{
    var match;
    program= program.trim();
    if( match= program.match(/^"(\s+)"&/)) return {type:"value",value: match[1]};
    else if(match = program.match(/^"(\d+)"&/) ) return {type:"value",value: Number(match[1])};
    else if(match = program.match( /^[^\(]+$/) ) return {type:"word", name: match[0]};
    // add apply
    else {
        var result= {};
        var [p1,p2]= getOuterParensis(program);
        var word= program.substring(0,p1).trim();
        result.type="apply";
        result.operator= {type:"word", name:word};
        result.args=[];
        var args= split(program.substring(p1+1,p2));
        for(var i in args)
        {
            result.args.push(parseR(args[i]));
        }
        return result;
    }
}

/**
 * get the out most ().
 * @param input
 * @returns {*[]}
 */
function getOuterParensis(input){
    var p1= input.search(/\(/);
    console.log(input)
    if(p1 === -1) throw new SyntaxError("no () exist in apply construct")
    var count=1;
    var p2=p1;
    while(p2 < input.length && count !== 0)
    {
        p2=p2+1;
        if(input[p2]==="(" ) count++;
        if(input[p2] === ")") count--;
    }
    if(p2=== input.length) throw new SyntaxError("no corresponding )");
    return [p1,p2];
}

/**
 * splits the parameters of a function/operator based on ","
 * @param input
 * @returns {Array}
 */
function split(input){
    var result=[];
    var status=0;
    var pre=0;
    for(var i in input)
    {
        if(input[i]==="(") status ++;
        else if(input[i]=== ")") status --;
        if(input[i]==="," && status ===0) {
            result.push(input.substring(pre, i));
            pre=i+1;
        }
    }
    return result;
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




// " must be excaped in string.
var p1= "+(a,10)";
var p2= "define(x,10)"
var p3= "do(define(x,10),if(>(x,5)),print(\"larger\"), print(\"small\"))"
var p4= "\"xxxx\"";
console.log(parseR(p2));


