import { $axios } from '@/api'
import { ApiOk } from '@/api/types'
import { cn } from '@/utils/cn'
import { Tooltip } from '@mantine/core'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

export interface CaptchaImageRef {
  getCodeId: () => string
}

export const CaptchaImage = forwardRef<CaptchaImageRef, { className?: string }>(
  function CaptchaImage({ className }, ref) {
    const [imageData, setImageData] = useState('')
    const codeId = useRef('')

    function refreshCaptcha() {
      $axios
        .get<ApiOk<{ codeId: string; base64: string }>>('/user/get-captcha')
        .then(({ data }) => {
          setImageData(data.data.base64)
          codeId.current = data.data.codeId
        })
    }

    useEffect(() => {
      refreshCaptcha()
    }, [])

    useImperativeHandle(
      ref,
      () => ({
        getCodeId() {
          return codeId.current
        },
      }),
      [],
    )

    return (
      <Tooltip label="点击更换" position="bottom" withArrow>
        <img
          src={'data:image/png;base64,' + imageData}
          className={cn(
            'block h-9 w-20 cursor-pointer rounded border border-gray-300 object-fill',
            !imageData && 'opacity-0',
            className,
          )}
          onClick={refreshCaptcha}
        />
      </Tooltip>
    )
  },
)
