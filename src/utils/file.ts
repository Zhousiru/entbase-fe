export function isImageExt(ext: string) {
  if (
    ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'].includes(
      ext.toLowerCase(),
    )
  ) {
    return true
  }
  return false
}

export function isTextExt(ext: string) {
  if (['txt', 'md'].includes(ext.toLowerCase())) {
    return true
  }
  return false
}

export function joinPaths(...paths: string[]): string {
  const normalizedPaths = paths.map((path) =>
    path
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/')
      .replace(/\/\.$/, '/')
      .replace(/\/$/, ''),
  )

  let joinedPath = normalizedPaths.filter((p) => p !== '').join('/')
  if (!joinedPath.startsWith('/')) {
    joinedPath = '/' + joinedPath
  }

  return joinedPath
}

export function gotoParentPath(path: string): string {
  if (!path || path === '/') {
    return '/'
  }

  const parts = path.split('/').filter((part) => part !== '')
  parts.pop()

  const parentPath = '/' + parts.join('/')

  return parentPath || '/'
}
