const validTokens = new Set()

export function issueToken() {
  const token = crypto.randomUUID()
  validTokens.add(token)
  return token
}

export function isValidToken(token) {
  return validTokens.has(token)
}

export function revokeToken(token) {
  validTokens.delete(token)
}
