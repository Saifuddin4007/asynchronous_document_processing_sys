

const LoadingSpinner = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative">
        <div className="h-14 w-14 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-14 w-14 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
      </div>

      {message && (
        <p className="mt-5 text-sm text-gray-600 font-medium tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;




// const LoadingSpinner = ({ message }) => {
//     return (
//         <>
//             <div className="flex flex-col items-center justify-center mt-10">
//                 <div className='h-10 w-10 rounded-full border-4 border-gray-300 border-t-green-700 animate-spin'></div>
//                 {message && <p className='mt-2 text-sm text-black'>{message}</p>}
//             </div>
//         </>
//     )
// }

// export default LoadingSpinner