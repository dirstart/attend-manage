import AiStore from '@/utils/store';
import { ssoWeb } from '@/utils/config';

const TokenKey = 'AUTHORIZATION'
const AccountKey = 'USER'

export function getToken() {
  return AiStore.get(TokenKey);
}

export function setToken(token) {
  // 设置不过期
  return AiStore.set(TokenKey, token);
}

export function removeToken() {
  return AiStore.remove(TokenKey)
}

export function getUser() {
  return AiStore.get(AccountKey);
}

export function setUser(val) {
  return AiStore.set(AccountKey, val);
}

export function removeUser() {
  return AiStore.remove(AccountKey);
}

export function goLogin() {
  location.href = ssoWeb + 'login' + '?service=' + window.location.origin;
}