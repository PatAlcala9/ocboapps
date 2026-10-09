import { useNavigate } from '@solidjs/router'
import { _page } from 'stores/page'

export default async () => {
  const navigate = useNavigate()
  const page = _page.get()
  navigate(page)
}
