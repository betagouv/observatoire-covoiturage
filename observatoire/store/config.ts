
export const state = () => ({
  hasNewsletter : process.env.has_newsletter
})

export type ConfigState = ReturnType<typeof state>