import { $axios } from '@/api'
import { getExt } from '@/utils/file'
import { useQuery } from '@tanstack/react-query'
import { marked } from 'marked'

export function TextViewer({
  bucketId,
  path,
}: {
  bucketId?: number
  path: string
}) {
  const isMarkdown = getExt(path) === 'md'

  const { isSuccess, data } = useQuery({
    queryKey: ['file', bucketId, path],
    queryFn: () =>
      $axios.post<string>(
        '/file/get',
        { bucketId, path },
        { responseType: 'text' },
      ),
  })

  return (
    <div className="min-h-[300px] p-8">
      <div className="mx-auto max-w-[700px]">
        {isSuccess && (
          <>
            {isMarkdown ? (
              <div
                className="prose !max-w-none"
                dangerouslySetInnerHTML={{
                  __html: marked(data.data.replace(/^---$.*^---$/ms, ''), {}),
                }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{data.data}</div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
