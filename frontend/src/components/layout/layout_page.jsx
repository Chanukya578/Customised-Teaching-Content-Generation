import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'

/**
 * Layout component for rendering header, content, and footer.
 * 
 * This component is used to maintain the layout structure of the website by including a header,
 * rendering the content using the Outlet component from React Router, and displaying a footer.
*/
function Layout_page() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout_page;
