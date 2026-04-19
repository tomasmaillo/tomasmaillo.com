import { unstable_cache } from 'next/cache'
import 'server-only'

export type ContributionDay = {
  contributionCount: number
  date: string
}

type GitHubContributionResponse = {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number
          weeks: Array<{
            contributionDays: ContributionDay[]
          }>
        }
      }
    }
  }
  errors?: Array<{ message?: string }>
}

type GitHubUserCreatedAtResponse = {
  data?: {
    user?: {
      createdAt?: string
    }
  }
  errors?: Array<{ message?: string }>
}

export type ContributionData = {
  totalContributions: number
  weeks: ContributionDay[][]
}

export type ContributionDateRange = {
  from: string
  to: string
}

const MAX_DAYS_PER_REQUEST = 365

const query = `
query($userName:String!, $from: DateTime!, $to: DateTime!) {
  user(login: $userName){
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`

const userCreatedAtQuery = `
query($userName:String!) {
  user(login: $userName) {
    createdAt
  }
}
`

const getCachedUserCreatedAt = unstable_cache(
  async (userName: string): Promise<string> => {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error('Missing GITHUB_TOKEN')
    }

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userCreatedAtQuery,
        variables: { userName },
      }),
    })

    if (!res.ok) {
      throw new Error(
        `GitHub user metadata request failed with status ${res.status}`,
      )
    }

    const payload = (await res.json()) as GitHubUserCreatedAtResponse

    if (payload.errors?.length) {
      const firstError =
        payload.errors[0]?.message ?? 'Unknown GitHub GraphQL error'
      throw new Error(firstError)
    }

    const createdAt = payload.data?.user?.createdAt
    if (!createdAt) {
      throw new Error(`Could not read GitHub account date for "${userName}"`)
    }

    return createdAt
  },
  ['github-user-created-at'],
  {
    revalidate: 60 * 60 * 24, // 1 day
    tags: ['github-user-created-at'],
  },
)

const getCachedContributionData = unstable_cache(
  async (
    userName: string,
    dateRange: ContributionDateRange,
  ): Promise<ContributionData> => {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error('Missing GITHUB_TOKEN')
    }

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          userName,
          from: dateRange.from,
          to: dateRange.to,
        },
      }),
    })

    if (!res.ok) {
      throw new Error(`GitHub GraphQL request failed with status ${res.status}`)
    }

    const payload = (await res.json()) as GitHubContributionResponse

    if (payload.errors?.length) {
      const firstError =
        payload.errors[0]?.message ?? 'Unknown GitHub GraphQL error'
      throw new Error(firstError)
    }

    const calendar =
      payload.data?.user?.contributionsCollection?.contributionCalendar

    if (!calendar) {
      throw new Error(`Could not read contributions for "${userName}"`)
    }

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) => week.contributionDays),
    }
  },
  ['github-contributions'],
  {
    revalidate: 60 * 30, // 30 minutes
    tags: ['github-contributions'],
  },
)

export async function retrieveContributionData(
  userName: string,
  dateRange?: Partial<ContributionDateRange>,
): Promise<ContributionData> {
  const splitIntoRequestWindows = (
    fromIso: string,
    toIso: string,
  ): ContributionDateRange[] => {
    const fromDate = new Date(fromIso)
    const toDate = new Date(toIso)

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      throw new Error('Invalid contribution date range')
    }

    if (fromDate > toDate) {
      throw new Error('Contribution date range has "from" after "to"')
    }

    const windows: ContributionDateRange[] = []
    let cursor = fromDate

    while (cursor <= toDate) {
      const windowEnd = new Date(cursor)
      windowEnd.setUTCDate(windowEnd.getUTCDate() + (MAX_DAYS_PER_REQUEST - 1))

      if (windowEnd > toDate) {
        windowEnd.setTime(toDate.getTime())
      }

      windows.push({
        from: cursor.toISOString(),
        to: windowEnd.toISOString(),
      })

      const nextDay = new Date(windowEnd)
      nextDay.setUTCDate(nextDay.getUTCDate() + 1)
      cursor = nextDay
    }

    return windows
  }

  const now = new Date()
  const to = dateRange?.to ?? now.toISOString()
  const defaultFrom = new Date(now)
  defaultFrom.setUTCFullYear(defaultFrom.getUTCFullYear() - 1)
  const from = dateRange?.from ?? defaultFrom.toISOString()

  const userCreatedAt = await getCachedUserCreatedAt(userName)
  const clampedFromDate = new Date(
    Math.max(new Date(from).getTime(), new Date(userCreatedAt).getTime()),
  )
  const windows = splitIntoRequestWindows(clampedFromDate.toISOString(), to)

  let totalContributions = 0
  const allWeeks: ContributionDay[][] = []

  for (const window of windows) {
    const windowData = await getCachedContributionData(userName, window)
    totalContributions += windowData.totalContributions
    allWeeks.push(...windowData.weeks)
  }

  return {
    totalContributions,
    weeks: allWeeks,
  }
}
