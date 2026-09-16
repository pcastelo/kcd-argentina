import organizersData from '@/data/organizers.json'
import {
  type Organizer,
  organizersSchema,
} from '@/schemas/collectionSchemas'

export function getOrganizers(): Organizer[] {
  const result = organizersSchema.safeParse(organizersData)
  if (!result.success) {
    throw new Error(`Invalid organizers.json: ${result.error.message}`)
  }

  return [...result.data].sort((left, right) => {
    if (left.placeholder && !right.placeholder) {
      return 1
    }
    if (!left.placeholder && right.placeholder) {
      return -1
    }

    return left.name.localeCompare(right.name)
  })
}
