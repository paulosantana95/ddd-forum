import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event";

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this), 
      AnswerCommentCreatedEvent.name
    )
  }

  private async sendNewAnswerCommentNotification({ answerComment }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(
      answerComment.answerId.toString()
    )

    if(answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: `Nova comentário em sua resposta "${answer.content.substring(0, 40).concat('...')}"`,
        content: answerComment.content.substring(0, 20).concat('...')
      })
    }
  }
}
