/* eslint-disable camelcase */
const axios = require('axios')
const { join, split } = require('ramda')

const MlDomain = require('../domains/mercadoLibre')

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
  },
  deletePermission: {
    url: (sellerId) =>
      `https://api.mercadolibre.com/users/${sellerId}/applications/${client_id}`,
    method: 'DELETE'
  },
  adsBySeller: {
    url: 'https://api.mercadolibre.com/sites/MLB/search?seller_id=',
    method: 'GET',
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
    headers: { authorization: `Bearer ${token}` }
  })
  return refreshTokenResponse
}

const updateAds = async (payload) => {
  const token = await MlDomain.getToken(payload.accountId)
  const [item_id, variation_id] = split('-', payload.id)

  const body = variation_id
    ? {
        variations: [
          {
            id: variation_id,
            price: payload.price
          }
        ]
      }
    : {
        price: payload.price
      }

  const itemResponse = await axios.put(`${urls.ads.url}/${item_id}`, body, {
    headers: { authorization: `Bearer ${token}` }
  })
  return itemResponse
}

const getAds = async (token, seller_id, scroll_id) => {
  const response = await axios.get(
    `https://api.mercadolibre.com/users/${seller_id}/items/search?search_type=scan${
      scroll_id ? `&scroll_id=${scroll_id}` : ''
    }&limit=100&orders=start_time_desc`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response
}

const multiget = async (token, ids, attributes) => {
  const response = await axios.get(
    `https://api.mercadolibre.com/items?ids=${join(
      ',',
      ids
    )}&include_attributes=all&attributes=${join(',', attributes)}
		`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  return response
}

const revokePermission = async (token) => {
  const permissionResponse = await axios.delete(urls.deletePermission.url, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return permissionResponse
}

const mercadoLibreJs = {
  authorization: {
    token,
    refreshToken
  },
  ads: {
    update: updateAds,
    get: getAds
  },
  item: {
    multiget
  },
  user: {
    myInfo,
    revokePermission
  }
}

module.exports = mercadoLibreJs
