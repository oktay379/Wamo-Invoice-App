import React, { useEffect, useState } from 'react';
import InvoicePreview from './InvoicePreview';
import toast from 'react-hot-toast';
import { GoTrash } from "react-icons/go";
import { FaPencilAlt } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
import collect from 'collect.js';
import html2canvas from 'html2canvas';
import {jsPDF} from "jspdf";
import { useForm } from 'react-hook-form';

const InvoiceForm = () => {
  const {register, handleSubmit, formState: {errors}, reset} = useForm();

  // date
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedOption, setSelectedOption] = useState("15 days");

  // Item
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [vatRate, setVatRate] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  const [totalExclVat, setTotalExclVat] = useState(0);
  const [totalVatAmount, setTotalVatAmount] = useState(0);

  useEffect(() => {
    let totalExclVat = 0;
    let totalVat = 0;

    items.forEach(item => {
      const itemTotalExclVat = item.quantity * item.price;
      const itemVat = (itemTotalExclVat * item.vatRate) / 100;
      totalExclVat += itemTotalExclVat;
      totalVat += itemVat;
    });

    setTotalExclVat(totalExclVat);
    setTotalVatAmount(totalVat);
  }, [items]);


  const handleOptionClick = (option) => {
    setSelectedOption(option);
    let date = new Date();
    if (option === "15 days") {
      date.setDate(date.getDate() + 15);
    } else if (option === "30 days") {
      date.setDate(date.getDate() + 30);
    } else if (option === "On receipt") {
      date = new Date(); 
    }
    setDueDate(date.toISOString().split("T")[0]);
  };

  const values = {
    totalExclVat,
    totalVatAmount,
    invoiceDate,
    setInvoiceDate,
    dueDate,
    setDueDate,
    item,
    setItem,
    quantity,
    setQuantity,
    price,
    setPrice,
    total,
    setTotal,
    items,
    setItems,
    totalAmount,
    vatRate
  };

  const createPDF = () => {
    const invoice = document.getElementById("pdf");
    html2canvas(invoice, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then((canvas) => {
      const imgWidth = 208;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL("img/png");
      const pdf = new jsPDF("portrait", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Wamo.pdf`);
    });
  }



  const onSubmit = () => {
    const vatAmount = (quantity * price * vatRate) / 100;
    const totalWithVat = quantity * price + vatAmount;
  
    const newItem = {
      id: uuidv4(),
      item,
      quantity,
      price,
      vatRate,
      total: totalWithVat
    };
  
    setItems([newItem, ...items]);
    setItem("");
    setQuantity("");
    setPrice("");
    setVatRate(0);
    reset();
  };
  
  
  const calculateTotal = () => {
    const vatAmount = (quantity * price * vatRate) / 100;
    setTotal(quantity * price + vatAmount);
  };
  
  useEffect(() => {
    calculateTotal();
  }, [quantity, price, vatRate]);
  

  const calculateTotalAmount = () => {
    const allItems = items.map((item) => item.total);
    setTotalAmount(collect(allItems).sum());
  };

  useEffect(() => {
    calculateTotalAmount();
  });

  const handleDelete = (id) => {
    setItems(items.filter((row) => row.id !== id))
    toast.error("Item deleted");
  }

  const handleDownload = () => {  
    if (items.length === 0) {
      toast.error("At least 1 item must be entered");
    } else {
      createPDF();
    }
  };

  return (
    <>
      <section className="grid grid-cols-2 gap-8">
        {/* First Page */}
        <div className="p-3 ml-4">
          
          <div className='my-8'>
            <h1 className='text-3xl font-bold'>New invoice #INV-71</h1>
            <p className='text-slate-500 mt-2'>
              Tailor invoices for your customers, add items, and manage your accounts receivable effortlessly.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5">
            <div className="mt-4">
              <label htmlFor="invoice-date" className="block text-sm font-medium text-gray-700">
                Issue Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  {...register("invoiceDate", {
                    required: "Invoice-date Required",
                  })}
                  type="date"
                  id="invoice-date"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
                {errors.invoiceDate && <span className="text-red-500">{errors.invoiceDate.message}</span>}
              </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <div className="mt-2 flex space-x-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full ${
                      selectedOption === "On receipt"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                    onClick={() => handleOptionClick("On receipt")}
                  >
                    On receipt
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full ${
                      selectedOption === "15 days"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                    onClick={() => handleOptionClick("15 days")}
                  >
                    15 days
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full ${
                      selectedOption === "30 days"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                    onClick={() => handleOptionClick("30 days")}
                  >
                    30 days
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full ${
                      selectedOption === "Custom"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                    onClick={() => setSelectedOption("Custom")}
                  >
                    Custom
                  </button>
                </div>
                {selectedOption === "Custom" && (
                  <div className="mt-2 relative rounded-md shadow-sm">
                    <input
                      type="date"
                      name="due-date"
                      id="due-date"
                      className="block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Add Item */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col">
                  <label htmlFor="item-name" className="text-sm font-medium text-gray-700">Title</label>
                  <input
                    {...register("itemName", {
                      required: "Item name is required",
                    })}
                    type="text"
                    id="item-name"
                    placeholder="Item name"
                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setItem(e.target.value)}
                  />
                  {errors.itemName && <span className="text-red-500">{errors.itemName.message}</span>}
                  </div>
                  

                  <div className="flex flex-col">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    {...register("quantity", { required: "Quantity is required" })}
                    type="number"
                    id="quantity"
                    placeholder="0"
                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  {errors.quantity && <span className="text-red-500">{errors.quantity.message}</span>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="flex flex-col">
                  <label htmlFor="price" className="text-sm font-medium text-gray-700">€ Price</label>
                  <input
                    {...register("price", { required: "Price is required" })}
                    type="number"
                    id="price"
                    placeholder="Price"
                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  {errors.price && <span className="text-red-500">{errors.price.message}</span>}

                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="total" className="text-sm font-medium text-gray-700">Total</label>
                    <div className="mt-1 p-2 border rounded-md bg-gray-100">
                      {total.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col mt-4">
                  <label htmlFor="vat" className="text-sm font-medium text-gray-700">VAT Rate</label>
                  <div className="flex space-x-2 mt-1">
                    <button
                      type="button"
                      className="flex-1 p-2 border rounded-md bg-blue-50 text-blue-700"
                      onClick={() => setVatRate(0)}
                    >
                      0%
                    </button>
                    <button
                      type="button"
                      className="flex-1 p-2 border rounded-md bg-blue-50 text-blue-700"
                      onClick={() => setVatRate(10)}
                    >
                      10%
                    </button>
                    <button
                      type="button"
                      className="flex-1 p-2 border rounded-md bg-blue-50 text-blue-700"
                      onClick={() => setVatRate(20)}
                    >
                      20%
                    </button>
                  </div>
                  <input
                    {...register("vat", {
                      max: { value: 100, message: "VAT cannot be more than 100" }
                    })}
                    type="number"
                    name="vat"
                    id="vat"
                    value={vatRate}
                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setVatRate(e.target.value)}
                  />
                  {errors.vat && <span className="text-red-500">{errors.vat.message}</span>}
                </div>


                <div className="flex justify-end mt-6">
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700">
                    Add Item
                  </button>
                </div>
              </div>

              <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white rounded-lg shadow-lg p-4">
                  <div className="flex-1 flex gap-4 py-4 px-6 bg-gray-50 rounded-lg shadow-inner">
                    <p className="flex-1 text-lg font-semibold text-gray-900">Item: {item.item}</p>
                    <p className="flex-1 text-lg font-semibold text-center text-gray-900">Quantity: {item.quantity}</p>
                    <p className="flex-1 text-lg font-semibold text-right text-gray-900">Price: ${item.price}</p>
                  </div>
                  
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="ml-4 flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                  >
                    <GoTrash />
                  </button>
                </div>
              ))}
              </div>

            </div>
          </form>
          
          <div className="mt-8 pb-12 flex justify-center items-center">
            <button 
              onClick={handleDownload} 
              className="bg-green-500 text-white w-full py-2 rounded-md shadow hover:bg-green-700 text-center"
            >
              Download
            </button>
          </div>

        </div>

        {/* Second Page */}
        <div>
          <InvoicePreview values={values}/>
        </div>

      </section>
    </>
  );
};

export default InvoiceForm;
