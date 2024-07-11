import { CiFileOn } from "react-icons/ci";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-20 bg-white p-4 border-r border-slate-200 flex flex-col items-center justify-between">
      <div className="flex flex-col items-center">
        <div className="rounded-md flex items-center justify-center mb-5">
          <img
            className="h-10"
            src="data:image/png;base64,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"
            alt="wamo"
          />
        </div>
        <div className="mt-3 bg-indigo-600 h-10 w-10 text-white rounded-xl flex items-center justify-center">
          <CiFileOn size={30} color="white"/>
        </div>
      </div>
      <div className="mb-5">
        <div className="bg-indigo-600 h-10 w-10 text-white rounded-full flex items-center justify-center">
          OA
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

