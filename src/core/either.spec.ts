import { Either, left, right } from "./either"

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if(shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = doSomething(true)

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toEqual(false)
})

test('success result', () => {
  const result = left('error')

  expect(result.isLeft()).toEqual(true)
  expect(result.isRight()).toEqual(false)
})
