

const LoadingSpinner = ({ message }) => {
    return (
        <>
            <div className="flex flex-col items-center justify-center mt-10">
                <div className='h-10 w-10 rounded-full border-4 border-gray-300 border-t-green-700 animate-spin'></div>
                {message && <p className='mt-2 text-sm text-black'>{message}</p>}
            </div>
        </>
    )
}

export default LoadingSpinner