




const StatusBadge = ({ status }) => {
  const styles = {
    queued:
      "bg-gray-100 text-gray-700 border border-gray-300",

    processing:
      "bg-blue-100 text-blue-700 border border-blue-300",

    completed:
      "bg-green-100 text-green-700 border border-green-300",

    failed:
      "bg-red-100 text-red-700 border border-red-300",

    retrying:
      "bg-amber-100 text-amber-700 border border-amber-300",
  };

  return (
    <span
      className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide capitalize shadow-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;













// const StatusBadge = ({ status }) => {
//     const styles = {
//         queued: 'bg-gray-100 text-gray-600',
//         processing: 'bg-blue-100 text-blue-700',
//         completed: 'bg-green-100 text-green-700',
//         failed: 'bg-red-100 text-red-700',
//         retrying: 'bg-amber-100 text-amber-700',
//     };

//     return (
//         <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>{status}</span>

//     )
// }

// export default StatusBadge