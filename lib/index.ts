import { Visitor } from '@programmerraj/json-transformer/dist/umd/visitor'
import { ObjectEntryNode, ObjectNode } from '@programmerraj/json-transformer/dist/umd/node'
import last from 'last-element'
import { generate, parser } from '@programmerraj/json-transformer'
import { Json } from '@programmerraj/json-transformer/dist/umd/json'

export class UndefinedFunctionError extends ReferenceError {
  constructor (name: string) {
    super(`Cannot call non-existent function with name: '${name}'`)
  }
}

export type CustomFunction = (...params: any[]) => Json

export interface Functions {
  [name: string]: CustomFunction
}

export const jsonf = (functions: Functions): Visitor => {
  let multipleKeys = false
  const isJsonf: boolean[] = []

  return {
    Object: {
      enter: path => {
        multipleKeys = (path.node as ObjectNode).entries.length > 1
        isJsonf.push(false)
      },
      exit: path => {
        // TODO: Once `last-element` has typescript definitions, we won't need to disable next line.
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (last(isJsonf)) {
          const { value } = (path.node as ObjectNode).entries[0]
          const [name, ...params] = generate(value) as [string, ...any[]]
          const fn = functions[name]
          if (fn === undefined) throw new UndefinedFunctionError(name)
          path.replace(parser(fn(...params)))
        }
        isJsonf.pop()
      }
    },
    ObjectEntry: {
      enter: path => {
        if ((path.node as ObjectEntryNode).key === '$jsonf') {
          if (multipleKeys) throw new Error('$jsonf cannot be used with any other keys.')
          isJsonf[isJsonf.length - 1] = true
        }
      }
    }
  }
}
