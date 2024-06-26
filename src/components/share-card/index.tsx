export function ShareCard({
  name,
  startTime,
  endTime,
  filePath,
}: {
  name: string
  startTime: string
  endTime: string
  filePath: string
}) {
  return (
    <div className="text-md flex flex-row justify-between gap-6 rounded border p-6 text-gray-600 transition hover:shadow-lg">
      <div>
        <div className="font-black ">
          文件名：
          {name ? name : '未命名'}
        </div>
        <div>文件路径：{filePath}</div>
      </div>
      <div className="flex flex-row gap-6 self-end text-sm ">
        <div>起始时间：{startTime}</div>
        <div>结束时间：{endTime}</div>
      </div>
    </div>
  )
}
