/* Server-side Rendering Example */
/* Modify in the future */

import { useRouter } from 'next/router'
import Link from 'next/link'

interface IProps {
  article: any
}

const article: React.FC<IProps> = ({ article }) => {
  const router = useRouter()
  const { id } = router.query
  console.log('article: ', article)
  console.log('id: ', id)
  return (
    <div>
      <h3>{id}</h3>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <br />
      <Link href='/'>Go Back</Link>
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${context.params.id}`,
  )
  const article = await res.json()
  return {
    props: {
      article,
    },
  }
}

export default article
