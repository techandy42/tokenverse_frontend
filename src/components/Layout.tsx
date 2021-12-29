import Nav from './Nav'
import Meta from './Meta'
import { ReactElement } from 'react'

interface IProps {
  children: ReactElement
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Meta />
      <Nav />
      <div>
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
