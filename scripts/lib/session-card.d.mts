export type SessionCardInput = {
  title: string
  typeLabel: string
  speakers: Array<{ name: string; affiliation?: string; photo?: string }>
  dateLabel: string
  timeLabel: string
  roomLabel: string
  venue: string
  siteName: string
}

export const CARD_WIDTH: number
export const CARD_HEIGHT: number
export const RENDER_SCALE: number
export function renderSessionCard(card: SessionCardInput): Promise<Buffer>
