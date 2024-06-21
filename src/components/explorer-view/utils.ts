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
