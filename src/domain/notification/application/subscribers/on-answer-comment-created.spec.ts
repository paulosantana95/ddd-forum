import { makeAnswer } from "test/factories/make-answer"
import { OnAnswerCreated } from "./on-answer-created"
import { InMemoryAnswersRepository } from "test/repository/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repository/in-memory-answer-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repository/in-memory-questions-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repository/in-memory-question-attachments-repository"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repository/in-memory-notifications-repository"
import { makeQuestion } from "test/factories/make-question"
import { MockInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"
import { makeAnswerComment } from "test/factories/make-answer-comment"
import { InMemoryAnswerCommentsRepository } from "test/repository/in-memory-answer-comments-repository"
import { OnAnswerCommentCreated } from "./on-answer-comment-created"

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Comment Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = 
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository
    )
    inMemoryAnswerAttachmentsRepository = 
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    )
    inMemoryNotificationsRepository = 
      new InMemoryNotificationsRepository()
    inMemoryAnswerCommentsRepository = 
      new InMemoryAnswerCommentsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCommentCreated(inMemoryAnswersRepository, sendNotificationUseCase)
  })

  it('should send a notification to answer author when a answer comment is created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id
    })
    const answerComment = makeAnswerComment({
      answerId: answer.id
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)
    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
