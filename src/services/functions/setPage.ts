import { _page } from 'stores/page'

export default async (page: string) => {
  _page.set(page)
}
