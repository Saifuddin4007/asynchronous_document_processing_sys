

const ResultDisplay = ({ results }) => {
  const text = results.extracted_data?.text || '';
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className="border-double border-2 border-gray-600 flex flex-col h-full w-fit">
      <p className="bg-amber-100 text-md rounded-sm">File Name: {results.original_filename}</p>
      <p className="bg-amber-100 text-md rounded-sm">Word Count: {wordCount}</p>
      {results.extracted_data?.numPage &&
        <p className="bg-amber-100 text-md rounded-sm">Page Count: {results.extracted_data.numPage}</p>
      }
      <div className="h-40 overflow-y-scroll text-md bg-blue-300 rounded-2xl">{text}</div>
    </div>
  )
}

export default ResultDisplay