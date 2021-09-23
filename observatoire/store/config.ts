
export const state = () => ({
  hasNewsletter : process.env.NEWSLETTER
})

export type ConfigState = ReturnType<typeof state>