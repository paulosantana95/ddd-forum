import { InMemoryNotificationsRepository } from 'test/repository/in-memory-notifications-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-id',
      title: 'Notification title',
      content: 'This is a new notification',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification
    )
  })
})
