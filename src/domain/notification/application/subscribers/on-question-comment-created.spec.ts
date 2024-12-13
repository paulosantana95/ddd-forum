import { makeAnswer } from "test/factories/make-answer"
import { InMemoryAnswersRepository } from "test/repository/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repository/in-memory-answer-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repository/in-memory-questions-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repository/in-memory-question-attachments-repository"
import { SendNotificationUseCase, SendNotificationUseCaseRequest, SendNotificationUseCaseResponse } from "../use-cases/send-notification"
import { InMemoryNotificationsRepository } from "test/repository/in-memory-notifications-repository"
import { makeQuestion } from "test/factories/make-question"
import { MockInstance } from "vitest"
import { waitFor } from "test/utils/wait-for"
import { OnQuestionCommentCreated } from "./on-question-comment-created"
import { makeQuestionComment } from "test/factories/make-question-comment"
import { InMemoryQuestionCommentsRepository } from "test/repository/in-memory-question-comments-repository"

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  (
    request: SendNotificationUseCaseRequest
  ) => Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
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
      inMemoryQuestionCommentsRepository = 
      new InMemoryQuestionCommentsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionCommentCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
  })

  it('should send a notification to question author when a question comment is created', async () => {
    const question = makeQuestion()
    const questionComment = makeQuestionComment({
      questionId: question.id
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
