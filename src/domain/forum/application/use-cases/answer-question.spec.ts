import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    console.log(answer)
  },
}

test('create an answer', async () => {
  const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

  const answer = await answerQuestion.execute({
    questionId: 'question-id',
    InstructorId: 'instructor-id',
    content: 'This is an answer',
  })

  expect(answer.content).toEqual('This is an answer')
})
