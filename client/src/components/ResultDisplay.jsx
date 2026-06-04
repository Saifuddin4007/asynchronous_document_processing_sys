



const ResultDisplay = ({ results }) => {
  const text = results.extracted_data?.text || "";

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">
          Extracted Results
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Document processing completed successfully
        </p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6">
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            File Name
          </p>

          <p className="mt-2 text-sm font-semibold text-gray-800 break-words">
            {results.original_filename}
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Word Count
          </p>

          <p className="mt-2 text-lg font-bold text-green-700">
            {wordCount}
          </p>
        </div>

        {results.extracted_data?.numPage && (
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Page Count
            </p>

            <p className="mt-2 text-lg font-bold text-blue-700">
              {results.extracted_data.numPage}
            </p>
          </div>
        )}
      </div>

      {/* Extracted Text */}
      <div className="px-6 pb-6">
        <div className="bg-slate-900 text-gray-100 rounded-2xl p-5 h-[400px] overflow-y-auto shadow-inner">
          <pre className="whitespace-pre-wrap break-words text-sm leading-7 font-mono">
            {text || "No extracted text available"}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;














// const ResultDisplay = ({ results }) => {
//   const text = results.extracted_data?.text || '';
//   const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
//   return (
//     <div className="border-double border-2 border-gray-600 flex flex-col h-full w-fit">
//       <p className="bg-amber-100 text-md rounded-sm">File Name: {results.original_filename}</p>
//       <p className="bg-amber-100 text-md rounded-sm">Word Count: {wordCount}</p>
//       {results.extracted_data?.numPage &&
//         <p className="bg-amber-100 text-md rounded-sm">Page Count: {results.extracted_data.numPage}</p>
//       }
//       <div className="h-40 overflow-y-scroll text-md bg-blue-300 rounded-2xl">{text}</div>
//     </div>
//   )
// }

// export default ResultDisplay