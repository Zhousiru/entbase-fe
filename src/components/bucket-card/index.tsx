export function BucketCard({ name }: { name: string }) {
  return (
    <div className="rounded border p-4 transition hover:shadow-lg">{name}</div>
  )
}
