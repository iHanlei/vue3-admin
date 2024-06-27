import i18n from '@/locales'

const { t } = i18n.global

export const useValidator = () => {
  const requiredValidator = (_rule, value, callback) => {
    if (value === '') {
      callback(new Error(t('common.required')))
    } else {
      callback()
    }
  }

  const passwordValidator = (_rule, value, callback) => {
    if (value === '') {
      callback(new Error(t('common.required')))
    } else if (value.length < 6 || value.length > 20) {
      callback(new Error(t('validator.passwordValidator')))
    } else {
      callback()
    }
  }

  const emailValidator = (_rule, value, callback) => {
    value = value.trim()
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    if (value === '') {
      callback(new Error(t('common.required')))
    } else if (!reg.test(value)) {
      callback(new Error(t('validator.emailValidator')))
    } else {
      callback()
    }
  }

  const urlValidator = (_rule, value, callback) => {
    value = value.trim()
    const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
    if (value === '') {
      callback(new Error(t('common.required')))
    } else if (!reg.test(value)) {
      callback(new Error(t('validator.urlValidator')))
    } else {
      callback()
    }
  }

  return {
    requiredValidator,
    passwordValidator,
    emailValidator,
    urlValidator
  }
}
