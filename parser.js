'use strict'


/**
 * parse the program Recursively.
 * @param program
 * @returns {*}
 */
function parseR(program)
{

    var match;
    program= program.trim();
    if(program === "") throw new SyntaxError("nothing in program");
    if( match= program.match(/^"(\w*)"$/)) return {type:"value",value: match[1]};
    else if(match = program.match(/^(\d+)$/) ) return {type:"value",value: Number(match[1])};
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
            pre=Number(i)+1;
        }
        if(i == input.length-1) {
            result.push(input.substring(pre));
        }
    }
    return result;
}

module.exports= parseR;
