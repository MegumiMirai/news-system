import Login from "../pages/Login";
import NewsSandbox from "../pages/NewsSandbox";
import Home from '../pages/NewsSandbox/Home'
import UserList from '../pages/NewsSandbox/UserList'
import RoleList from '../pages/NewsSandbox/RoleList'
import RightList from '../pages/NewsSandbox/RightList'
import Nopermission from '../pages/NewsSandbox/Nopermission'
import { Navigate } from 'react-router-dom'
import NewsAdd from "../pages/NewsSandbox/NewsManage/NewsAdd";
import NewsDraft from "../pages/NewsSandbox/NewsManage/NewsDraft";
import NewsCategory from "../pages/NewsSandbox/NewsManage/NewsCategory";
import Audit from "../pages/NewsSandbox/AuditManage/Audit";
import AuditList from "../pages/NewsSandbox/AuditManage/AuditList";
import Unpublished from "../pages/NewsSandbox/PublishManage/Unpublished";
import Published from "../pages/NewsSandbox/PublishManage/Published";
import Sunset from "../pages/NewsSandbox/PublishManage/Sunset";
import NewsPreview from "../pages/NewsSandbox/NewsManage/NewsPreview";
import NewsUpdate from "../pages/NewsSandbox/NewsManage/NewsUpdate";
import News from "../pages/News/News";
import Detail from "../pages/News/Detail";
// import axios from "axios";

// const LocalRouterMap = {
//   "/home": Home,
//   "/user-manage/list":UserList,
//   "/right-manage/role/list": RoleList,
//   "/right-manage/right/list": RightList,
//   "/news-manage/add": NewsAdd,
//   "/news-manage/draft": NewsDraft,
//   "/news-manage/category": NewsCategory,
//   "/audit-manage/audit": Audit,
//   "/audit-manage/list": AuditList,
//   "/publish-manage/unpublished": Unpublished,
//   "/publish-manage/published": Published,
//   "/publish-manage/sunset": Sunset
// }
// let BackRouteList = []
//
// function getData(){
//   Promise.all([
//       axios.get('http://localhost:5000/rights'),
//       axios.get('http://localhost:5000/children')
//   ]).then(
//       res => {
//         BackRouteList = [
//             ...res[0].data,
//             ...res[1].data
//         ]
//         console.log(BackRouteList)
//       }
//   )
// }
// getData()


export default [
  {
    path: '/login',
    element: <Login/>
  },
  // {
  //   path: '/sendbox',
  //   element: <NewsSandbox/>
  // },
  {
    path: '/',
    // element:  <NewsSandbox/>,
    element: localStorage.getItem('token') ? <NewsSandbox/> : <Login/>,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/user-manage/list',
        element: <UserList/>
      },
      {
        path: '/right-manage/role/list',
        element: <RoleList/>
      },
      {
        path: '/right-manage/right/list',
        element: <RightList/>
      },
      {
        path: '/news-manage/add',
        element: <NewsAdd/>
      },
      {
        path: '/news-manage/draft',
        element: <NewsDraft/>
      },
      {
        path: '/news-manage/category',
        element: <NewsCategory/>
      },
      {
        path: '/news-manage/preview/:id',
        element: <NewsPreview />
      },
      {
        path: '/news-manage/update/:id',
        element: <NewsUpdate />
      },
      {
        path: '/audit-manage/audit',
            element: <Audit/>
      },{
        path: '/audit-manage/list',
            element: <AuditList/>
      },{
        path: '/publish-manage/unpublished',
            element: <Unpublished/>
      },
      {
        path: '/publish-manage/published',
        element: <Published/>
      },
      {
        path: '/publish-manage/sunset',
        element: <Sunset/>
      },
      {
        path: '',
        element: <Navigate to='home' />
      },
      {
        path: '*',
        element: <Nopermission/>
      }
    ]
  },
  {
    path: '/news',
    element: <News/>
  },
  {
    path:'/detail/:id',
    element: <Detail/>
  }
]