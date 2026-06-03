import {exportData} from '../services/api.js';
import ResultDisplay from "../components/ResultDisplay";

const ResultPage = ({
  results,
  documentId,
  onReviewAndEdit,
  onAnotherDocProcess,
}) => {

  const handleExport= async (format= "json")=>{
    try{
      const res= await exportData(documentId, format);
      const url= window.URL.createObjectURL(res);
      const link= document.createElement('a');
      link.href= url;

      link.setAttribute(
        "download",
        `document-export.${format=== "json" ? "json" : "txt"}`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

    }catch(err){
      console.log(err);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Processing Results
            </h1>

            <p className="text-gray-500 mt-2">
              Review extracted document content
            </p>
          </div>

          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-200 w-fit">
            Completed
          </div>
        </div>

        {/* Result Card */}
        {results && <ResultDisplay results={results} />}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-end">
          <button
            className="bg-amber-400 hover:bg-amber-500 transition px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm"
            onClick={onReviewAndEdit}
          >
            Review & Edit
          </button>

          <div className="relative group">

  {/* Export Button */}
  <button
    onClick={() => handleExport()}
    className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm"
  >
    Export
  </button>

  {/* Invisible Hover Bridge */}
  <div className="absolute left-0 right-0 bottom-full h-6"></div>

  {/* Dropdown Menu */}
  <div
    className="
      absolute bottom-16 left-1/2 -translate-x-1/2
      flex flex-col gap-2
      bg-white border border-gray-200
      shadow-2xl rounded-2xl p-2
      min-w-[180px]
      opacity-0 invisible translate-y-2
      group-hover:opacity-100
      group-hover:visible
      group-hover:translate-y-0
      transition-all duration-200
      z-20
    "
  >

    <button
      onClick={() => handleExport("json")}
      className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-blue-50 text-gray-700 transition text-left"
    >
      Export as JSON
    </button>

    <button
      onClick={() => handleExport("txt")}
      className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-indigo-50 text-gray-700 transition text-left"
    >
      Export as TXT
    </button>

  </div>
</div>

          <button
            className="bg-red-100 hover:bg-red-200 transition text-red-700 px-6 py-3 rounded-2xl text-sm font-semibold shadow-sm"
            onClick={onAnotherDocProcess}
          >
            Process Another Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;














// import ResultDisplay from "../components/ResultDisplay"


// const ResultPage = ({results, documentId, onReviewAndEdit, onAnotherDocProcess}) => {
//   return (
//     <div className="flex flex-col gap-2.5">
//         {results && <ResultDisplay results={results}/>}
//         <div className="flex flex-row gap-1 justify-between items-baseline">
//             <button className="bg-amber-400 rounded-md p-2 m-1" onClick={onReviewAndEdit}>Review & Edit</button>
//             <button className="bg-blue-400 rounded-md p-2 m-1">Export Direct</button>
//             <button className="bg-red-300 rounded-md p-2 m-1" onClick={onAnotherDocProcess}>Process Another Doc</button>
//         </div>
        
//     </div>
//   )
// }

// export default ResultPage