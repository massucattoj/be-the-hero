import { botResponses } from './botResponses'

export const getRandomBotResponse = (): string => {
  return botResponses[Math.floor(Math.random() * botResponses.length)]
}
