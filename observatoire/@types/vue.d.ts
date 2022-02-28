declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}

declare module '*.json' {
  const json: { [key: string]: any }
  export default json
}