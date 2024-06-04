interface TokenPayload {
  isAdmin: string
  username: string
  userId: number
  icon: string
  userEmail: string
  exp: number
}

export function getTokenWithPayload(): [string, TokenPayload] {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new EmptyTokenError()
  }
  const payload = JSON.parse(atob(token.split('.')[1]))

  return [
    token,
    {
      isAdmin: payload.IsAdmin,
      username: payload.UserName,
      userId: payload.UserId,
      icon: payload.Icon,
      userEmail: payload.UserEmail,
      exp: payload.exp,
    },
  ]
}

export function assertNotExpiredToken(payload: TokenPayload) {
  if (Date.now() > payload.exp * 1000) {
    throw new InvalidTokenError()
  }
}

export function getValidToken() {
  const [token, payload] = getTokenWithPayload()
  assertNotExpiredToken(payload)

  return token
}

export function getValidTokenPayload() {
  const [_, payload] = getTokenWithPayload()
  assertNotExpiredToken(payload)

  return payload
}

export function setToken(token: string) {
  localStorage.setItem('token', token)
}

export function checkIsValidToken() {
  try {
    getValidToken()
  } catch (error) {
    if (error instanceof TokenError) {
      return false
    }
    throw error
  }
  return true
}

export class TokenError extends Error {}
export class InvalidTokenError extends TokenError {}
export class EmptyTokenError extends TokenError {}