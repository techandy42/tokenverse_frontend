import { format } from 'fecha'

type format = (date: Date, format?: string, i18n?: I18nSettings) => string

export default format
