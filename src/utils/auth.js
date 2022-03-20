import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-only-token' // 设定一个独一无二的key

const timeKey = 'hrsaas-time-key' // 设定一个独一无二的key

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getTime () {
  // 获取时间戳
  return Cookies.get(timeKey)
}

export function setTime () {
  // 读取时间戳
  Cookies.set(timeKey, Date.now())
}
