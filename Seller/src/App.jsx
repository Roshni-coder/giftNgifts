import React, { useState, createContext } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Slide } from '@mui/material';
import { IoMdClose } from "react-icons/io";

// Pages & Components
import Header from './Components/Header/Header.jsx';
import SideBar from './Components/Sidebar/SideBar.jsx';
import DashBoard from './Pages/DashBoard/DashBoard.jsx';
import ProductList from './Pages/Product Pages/ProductList.jsx';
import AddProduct from './Pages/Product Pages/AddProduct.jsx';
import OrdersList from './Pages/Orders Pages/OrdersList.jsx';
import CategoryList from './Pages/Category/CategoryList.jsx';
import AddCategory from './Pages/Category/AddCategory.jsx';
import SubCategoryList from './Pages/Category/SubCategoryList.jsx';
import AddSubCategory from './Pages/Category/AddSubCategory.jsx';
import SellerProfile from './Pages/Seller Profile/SellerProfile.jsx';
import Login from './Pages/Login/Login.jsx';
import ProtectedRoute from './Pages/ProtectedRoute.jsx';

export const MyContext = createContext();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Layout({ children }) {
  return (
    <section className="main h-screen w-full flex flex-col">
      <Header /> {/* Full width header */}
      <div className="flex w-full overflow-auto">
        <aside>
          <SideBar />
        </aside>
        <main className="!w-[100%] py-2 overflow-y-auto ">
          {children}
        </main>
      </div>
    </section>
  );
}

function App() {
  const [isOpenAddProductPanel, setIsOpenAddProductPanel] = useState({
    open: false,
    model: ''
  });

  const values = {
    isOpenAddProductPanel,
    setIsOpenAddProductPanel
  };

  const router = createBrowserRouter([
    { path: '/', element: <ProtectedRoute><Layout><DashBoard /></Layout></ProtectedRoute> },
    { path: '/login', element: <Login /> },
    { path: '/products', element: <ProtectedRoute><Layout><ProductList /></Layout></ProtectedRoute> },
    { path: '/orders', element: <ProtectedRoute><Layout><OrdersList /></Layout></ProtectedRoute> },
    { path: '/categorylist', element: <ProtectedRoute><Layout><CategoryList /></Layout></ProtectedRoute> },
    { path: '/subcategorylist', element: <ProtectedRoute><Layout><SubCategoryList /></Layout></ProtectedRoute> },
    { path: '/seller-profile', element: <ProtectedRoute><Layout><SellerProfile /></Layout></ProtectedRoute> },
  ]);

  return (
    <MyContext.Provider value={values}>
      <RouterProvider router={router} />

      {/* Dialog for Add Forms */}
      <Dialog
        fullScreen
        open={isOpenAddProductPanel.open}
        onClose={() => setIsOpenAddProductPanel({ open: false })}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} className="!bg-white !shadow-md !py-4">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setIsOpenAddProductPanel({ open: false })}
              aria-label="close"
            >
              <IoMdClose className="text-gray-800 text-[18px]" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className="text-gray-800">{isOpenAddProductPanel?.model}</span>
            </Typography>
          </Toolbar>
        </AppBar>

        {isOpenAddProductPanel?.model === 'Add Product' && <AddProduct />}
        {isOpenAddProductPanel?.model === 'Add New Category' && <AddCategory />}
        {isOpenAddProductPanel?.model === 'Add New Sub Category' && <AddSubCategory />}
      </Dialog>
    </MyContext.Provider>
  );
}

export default App;