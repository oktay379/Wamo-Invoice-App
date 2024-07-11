import { IoMdClose } from "react-icons/io";

const Navbar = () => {
    return (
        <div className="ml-20 w-full bg-white p-5 flex items-center gap-4 border-b border-slate-200">
            <IoMdClose size={24}/>
            <span className="text-sm text-slate-400">Invoice</span>
            <span className="text-md"><strong>New invoice #INV-71</strong></span>
        </div>
    );
}
  
export default Navbar;
