
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

module.exports= topEnv