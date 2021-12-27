import Nav from './Nav'
import Meta from './Meta'

interface IProps {
    children: any,
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <Meta />
      <Nav />
      <div>
        <main>
          {children}
        </main>
      </div>
    </>
  )
}
 
export default Layout