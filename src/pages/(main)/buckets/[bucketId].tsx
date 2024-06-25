import ExplorerView from '@/components/explorer-view'
import { useParams } from 'react-router-dom'

export default function Page() {
  const params = useParams()
  const bucketId = Number(params.bucketId!)

  return (
    <>
      <ExplorerView bucketId={bucketId} className="absolute inset-0" />
    </>
  )
}
