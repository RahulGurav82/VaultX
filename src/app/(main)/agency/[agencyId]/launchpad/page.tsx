import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

type Props = {
  params: {
    agencyId: string
  }
  searchParams: { code: string }
}

const LaunchPadPage = async ({ params, searchParams }: Props) => {
  const agencyDetails = await db.agency.findUnique({
    where: { id: params.agencyId },
  })

  if (!agencyDetails) return null

  // Redirect to the next path (e.g., dashboard)
  redirect(`/agency/${params.agencyId}/`)
}

export default LaunchPadPage
