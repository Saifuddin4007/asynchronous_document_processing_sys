import { useState, useEffect } from "react";
import { saveReviewedData } from "../services/api";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";

const ReviewAndEdit = ({ results, documentId, onBack }) => {

  const extractedText = results?.extracted_data?.text || "";

  const [editedText, setEditedText] = useState(
    results?.reviewed_data?.text || extractedText
  );

  const [isFinalized, setIsFinalized] = useState(
    results?.is_finalized || false
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (extractedText) {
      setEditedText(results?.reviewed_data?.text || extractedText);
    }
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess("");

      const reviewedData = { text: editedText };

      await saveReviewedData(documentId, reviewedData, isFinalized);

      setSuccess("Reviewed data saved successfully");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to save reviewed data"
      );
    } finally {
      setSaving(false);
    }
  };

  const wordCount = editedText.trim()
    ? editedText.trim().split(/\s+/).length
    : 0;

  const originalWordCount = extractedText.trim()
    ? extractedText.trim().split(/\s+/).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Review & Edit
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Original text on the left. Edit your reviewed version on the right.
            </p>
          </div>
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 transition px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700"
          >
            ← Back to Results
          </button>
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Left Panel — Original (Read Only) */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Original Extracted Text
              </span>
              <span className="text-xs text-gray-400">
                {originalWordCount} words
              </span>
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-5 overflow-y-auto h-[500px] text-sm text-gray-500 leading-7 select-none cursor-not-allowed">
              {extractedText || (
                <span className="text-gray-300 italic">No extracted text available</span>
              )}
            </div>
          </div>

          {/* Right Panel — Editable */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Your Reviewed Version
              </span>
              <span className="text-xs text-gray-400">
                {wordCount} words
              </span>
            </div>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="Edit the extracted text here..."
              className="flex-1 bg-white border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 rounded-2xl p-5 h-[500px] text-sm text-gray-800 leading-7 outline-none resize-none transition"
            />
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* Finalize Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFinalized}
              onChange={(e) => setIsFinalized(e.target.checked)}
              className="h-4 w-4 accent-green-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as Finalized
            </span>
            <span className="text-xs text-gray-400">
              (locks the reviewed version)
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white transition"
            >
              {saving ? "Saving..." : "Save Reviewed Data"}
            </button>
          </div>
        </div>

        {/* Feedback */}
        {saving && (
          <div className="mt-4">
            <LoadingSpinner message="Saving reviewed data..." />
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-xl text-sm font-medium">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} />
          </div>
        )}

      </div>
    </div>
  );
};

export default ReviewAndEdit;