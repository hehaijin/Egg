'use strict'

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

module.exports = evaluate; 