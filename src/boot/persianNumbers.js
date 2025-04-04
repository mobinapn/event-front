import { boot } from 'quasar'
import PersianNumbersDirective from 'src/directives/persianNumbers'

export default boot(({ app }) => {
  app.directive('persian-numbers', PersianNumbersDirective)
})
