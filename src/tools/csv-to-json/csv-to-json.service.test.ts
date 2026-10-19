import { describe, expect, it } from 'vitest';
import { convertCsvToJson } from './csv-to-json.service';

describe('csv-to-json service', () => {
  it('converts header-keyed string objects to JSON with two-space indentation', () => {
    expect(convertCsvToJson({ csv: 'name,age\nAlice,18\nBob,19' })).toEqual({
      success: true,
      output: '[\n  {\n    "name": "Alice",\n    "age": "18"\n  },\n  {\n    "name": "Bob",\n    "age": "19"\n  }\n]',
    });
  });

  it.each([
    ['quoted commas', 'name,note\nAlice,"hello, world"', [{ name: 'Alice', note: 'hello, world' }]],
    ['quoted line breaks', 'name,note\nAlice,"hello\nworld"', [{ name: 'Alice', note: 'hello\nworld' }]],
    ['escaped quotes', 'note\n"She said ""hello"""', [{ note: 'She said "hello"' }]],
    ['CRLF row endings', 'name,age\r\nAlice,18\r\nBob,19', [{ name: 'Alice', age: '18' }, { name: 'Bob', age: '19' }]],
    ['a trailing LF', 'name\nAlice\n', [{ name: 'Alice' }]],
    ['a trailing CRLF', 'name\r\nAlice\r\n', [{ name: 'Alice' }]],
    ['short rows', 'name,age,country\nAlice,18', [{ name: 'Alice', age: '18', country: '' }]],
    ['a header only', 'name,age\n', []],
    ['empty fields', 'a,b,c\n,,\nx,y,', [{ a: '', b: '', c: '' }, { a: 'x', b: 'y', c: '' }]],
    ['quoted headers', '"full,name",note\nAlice,hello', [{ 'full,name': 'Alice', 'note': 'hello' }]],
    ['empty quoted fields', 'name\n""', [{ name: '' }]],
    ['CRLF inside quotes', 'note\r\n"hello\r\nworld"', [{ note: 'hello\r\nworld' }]],
    ['an intentional blank row', 'name\nAlice\n\n', [{ name: 'Alice' }, { name: '' }]],
    ['special object keys', '__proto__,constructor\nsafe,string', [JSON.parse('{"__proto__":"safe","constructor":"string"}')]],
    ['whitespace and literal strings', 'a,b,c\n  text  ,null,true', [{ a: '  text  ', b: 'null', c: 'true' }]],
  ])('handles %s', (_name, csv, objects) => {
    expect(convertCsvToJson({ csv })).toEqual({ success: true, output: JSON.stringify(objects, null, 2) });
  });

  it('returns an explicit error when a row has too many fields', () => {
    expect(convertCsvToJson({ csv: 'name,age\nAlice,18,extra' })).toEqual({
      success: false,
      error: { code: 'long-row', row: 2 },
    });
  });

  it('returns an explicit error for an unterminated quoted field', () => {
    expect(convertCsvToJson({ csv: 'name,note\nAlice,"hello\nworld' })).toEqual({
      success: false,
      error: { code: 'unterminated-quote', row: 2 },
    });
  });

  it.each(['name\nAlice"', 'name\n"Alice"extra'])('rejects misplaced quotes in %s', (csv) => {
    expect(convertCsvToJson({ csv })).toEqual({
      success: false,
      error: { code: 'invalid-quote', row: 2 },
    });
  });

  it('returns empty output for empty input', () => {
    expect(convertCsvToJson({ csv: '' })).toEqual({ success: true, output: '' });
  });
});
