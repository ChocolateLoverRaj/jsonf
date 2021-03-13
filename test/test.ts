import { transform } from '@programmerraj/json-transformer'
import { Json } from '@programmerraj/json-transformer/dist/umd/json'
import { CustomFunction, Functions, jsonf, UndefinedFunctionError } from '../lib'
import { strictEqual, throws, deepStrictEqual } from 'assert'
import { spy } from 'sinon'
import jsonv from '@programmerraj/jsonv'

const transformJsonf = (json: Json, functions: Functions): Json => (
  transform(json, [jsonf(functions)])
)

it('Simple', () => {
  const myFn = spy<CustomFunction>((num1: number, num2: number) => num1 * num2)
  strictEqual(transformJsonf({
    $jsonf: ['myFn', 4, 5]
  }, { myFn }), 20)
  strictEqual(myFn.calledOnceWithExactly(4, 5), true)
})

it('Undefined function', () => {
  throws(() => {
    transformJsonf({
      $jsonf: ['eval']
    }, {})
  }, UndefinedFunctionError)
})

it('Nested', () => {
  const add = spy<CustomFunction>((num1: number, num2: number) => num1 + num2)
  const multiply = spy<CustomFunction>((num1: number, num2: number) => num1 * num2)
  strictEqual(transformJsonf({
    $jsonf: [
      'multiply',
      { $jsonf: ['add', 5, 6] },
      { $jsonf: ['add', 3, 4] }
    ]
  }, { add, multiply }), 77)
  strictEqual(add.calledTwice, true)
  strictEqual(add.firstCall.calledWithExactly(5, 6), true)
  strictEqual(add.secondCall.calledWithExactly(3, 4), true)
  strictEqual(multiply.calledOnceWithExactly(11, 7), true)
})

it('With jsonv', () => {
  const twice: CustomFunction = (v: any) => [v, v]
  const plus: CustomFunction = (n: number) => n + 1
  deepStrictEqual(transform({
    $jsonv: {
      first: { $jsonf: ['plus', 1] }
    },
    a: { $jsonv: 'first' },
    b: { $jsonf: ['plus', { $jsonv: 'first' }] }
  }, [jsonv(), jsonf({ plus, twice })]), {
    a: 2,
    b: 3
  })
})
