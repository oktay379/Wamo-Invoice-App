import React from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar';
import InvoiceForm from './pages/InvoiceForm';
import { Toaster } from 'react-hot-toast';


const App = () => {
  return (
    <div className="flex bg-gray-100">
      <Toaster />
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="ml-20"> 
          <InvoiceForm />
        </main>
      </div>
    </div>
  );
}

export default App;