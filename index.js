'use strict'
/* In the Egg language, everything is a expression
    Expression have a type property.
    3 types of expression. their types are: value, word, apply.
    Ev: {type:"value", value: xx}   for string and number literal.
    Ew: {type: "word", name: xx}    for variables/identifiers
    Ea: {type: "apply", operator: Ew, args:[Ev/Ew]}  for functions and operators. E means expression.
 */
const evaluate= require('./evaluate');
const topEnv= require('./env');
const parse= require('./parser');


function run(program)
{
    var env= Object.create(topEnv);
    return evaluate(parse(program), env);
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

