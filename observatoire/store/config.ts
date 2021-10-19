
export const state = () => ({
  hasNewsletter : process.env.NEWSLETTER || 'false'
})

export type ConfigState = ReturnType<typeof state>