const axios = require('axios')

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI

const urls = {
  token: {
    url: 'https://api.mercadolibre.com/oauth/token',
    method: 'POST'
  },
  refreshToken: {
    url: (clientId, clientSecret, refreshToken) =>
      `https://api.mercadolibre.com/oauth/token?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`,
    method: 'POST',
    payload: {}
  },
  user: {
    url: 'https://api.mercadolibre.com/users/me',
    method: 'GET',
    headers: { authorization: 'Bearer token' }
  },
  ads: {
    url: 'https://api.mercadolibre.com/items',
    method: 'PUT',
    headers: { authorization: 'Bearer token' }
  }
}

const token = async (code) => {
  const tokenResponse = await axios.post(urls.token.url, {
    grant_type: 'authorization_code',
    client_id,
    client_secret,
    code,
    redirect_uri
  })
  return tokenResponse
}

const refreshToken = async (refreshToken) => {
  const refreshTokenResponse = await axios.post(
    urls.refreshToken.url(client_id, client_secret, refreshToken)
  )
  return refreshTokenResponse
}

const myInfo = async (token) => {
  const refreshTokenResponse = await axios.get(urls.user.url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return refreshTokenResponse
}

const updateAds = async (token, itemId, payload) => {
  const itemResponse = await axios.put(`${urls.ads.url}/${itemId}`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return itemResponse
}

const mercadoLibreJs = {
  authorization: {
    token,
    refreshToken
  },
  ads: {
    update: updateAds
  },
  user: {
    myInfo
  }
}

module.exports = mercadoLibreJs
