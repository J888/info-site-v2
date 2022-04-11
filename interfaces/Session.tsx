import { IronSession } from "iron-session"

export interface SessionDecorated extends IronSession {
  user?: {
    username: string
    admin: boolean
  }
}
