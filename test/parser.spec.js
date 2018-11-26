'use strict'
const parse = require('../parser.js');
const expect = require('chai').expect;
describe('parse', ()=> {
    it('should be a function', ()=>{
        expect(parse).to.be.a('function');
    });
    it('should correctly parse string input', ()=> {
        const input= "\"test\"";
        const result= parse(input);
        expect(result.type).to.equal('value');
        expect(result.value).to.equal('test');
    } );

    it('should correctly parse number', ()=> {
        const input= "12345";
        const result= parse(input);
        expect(result.type).to.equal('value');
        expect(result.value).to.equal(12345);
    } );

    it('should correctly parse word input', ()=> {
        const input= "xx";
        const result= parse(input);
        expect(result.type).to.equal('word');
        expect(result.name).to.equal('xx');
    } );

    it('should correctly parse simple apply', ()=> {
        const input= ">(x,10)";
        const result= parse(input);
        expect(result.type).to.equal('apply');
        expect(result.operator.type).to.equal('word');
        expect(result.operator.name).to.equal('>');
        expect(result.args.length).to.equal(2);
        expect(result.args[0].type).to.equal('word');
        expect(result.args[0].name).to.equal('x');
        expect(result.args[1].type).to.equal('value');
        expect(result.args[1].value).to.equal(10);
    } );
    

});
