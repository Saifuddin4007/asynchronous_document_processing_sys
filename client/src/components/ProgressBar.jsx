



const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-700">
          Processing Document
        </p>

        <p className="text-sm font-semibold text-green-700">
          {progress}%
        </p>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;











