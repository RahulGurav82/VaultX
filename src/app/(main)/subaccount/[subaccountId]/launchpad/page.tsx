import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import axios from 'axios'

type Props = {
  params: {
    subaccountId: string
  }
  searchParams: { code: string }
}

const scanFile = async (hash: string) => {
  const apiKey = process.env.VIRUSTOTAL_API_KEY
  try {
    const response = await axios.get(
      `https://www.virustotal.com/vtapi/v2/file/report`,
      {
        params: {
          apikey: apiKey,
          resource: hash
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error scanning file:', error)
    throw new Error('Failed to scan file')
  }
}

const LaunchPad = async ({ params, searchParams }: Props) => {
  const subaccountDetails = await db.subAccount.findUnique({
    where: { id: params.subaccountId },
  })

  if (!subaccountDetails) return null

  // Add file scanning before redirect
  try {
    const fileHash = 'dcf7873aa7e479060b21f5bbcc595472e40989289b2e034cf5e677f178f0a198'
    const scanResult = await scanFile(fileHash)
    
    if (scanResult.positives > 0) {
      throw new Error('Potentially malicious file detected')
    }
  } catch (error) {
    console.error('Virus scan failed:', error)
    // Handle the error appropriately - maybe redirect to an error page
    redirect(`/subaccount/${params.subaccountId}/error`)
  }

  // Redirect to the subaccount dashboard
  redirect(`/subaccount/${params.subaccountId}/`)
}

export default LaunchPad
