import { createBrowserRouter, RouterProvider } from "react-router-dom"

import RootLayout from "./components/RootLayout"
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"
import AddArticle from "./components/AddArticle"
import UserDashboard from "./components/UserDashboard"
import AuthorDashboard from "./components/AuthorDashboard"
import AdminDashboard from "./components/AdminDashboard"
import ArticleRead from "./components/ArticleRead"
import AuthorArticles from "./components/AuthorArticles"
import EditArticle from "./components/EditArticleForm"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProtectedRoute"
import Unauthorized from "./components/Unauthorized"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children:[
      {
        path:"/", element:<Home/>
      },
      {
        path:"register", element:<Register/>
      },
      {
        path:"login", element:<Login/>
      },
      {
        path:"addarticle", element:<AddArticle/>
      },
      {
        path:"userdashboard", element:<ProtectedRoute allowedRoles={["USER"]}><UserDashboard/></ProtectedRoute>
      },
      {
        path:"authordashboard", element:  <ProtectedRoute allowedRoles={["AUTHOR"]}><AuthorDashboard/></ProtectedRoute>
      },
      {
        path:"authors/:authorId", element:<ProtectedRoute allowedRoles={["USER","AUTHOR","ADMIN"]}><AuthorArticles/></ProtectedRoute>
      },
      {
        path:"edit-article", element:<ProtectedRoute allowedRoles={["AUTHOR"]}><EditArticle/></ProtectedRoute>
      },
      {
        path:"admindashboard", element:<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard/></ProtectedRoute>
      },
      {
        path:"articles/:id", element:<ProtectedRoute allowedRoles={["USER","AUTHOR","ADMIN"]}><ArticleRead/></ProtectedRoute>
      },
      {
        path:"unauthorized", element:<Unauthorized/>
      }
    ]
  }
])

function App(){
  return (
    <>
    <Toaster position="top-center" reverseOrder={false}/>
    <RouterProvider router={router}/>
    </>
  )
}

export default App