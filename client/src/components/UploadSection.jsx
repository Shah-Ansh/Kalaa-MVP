import axios from "axios";
import { useState } from "react";

const UploadSection = ({
  foreground,
  background,
  setForeground,
  setBackground,
  fgPreview,
  bgPreview,
  setFgPreview,
  setBgPreview,
  setResultUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [fgFilename, setFgFilename] = useState("");
  const [bgFilename, setBgFilename] = useState("");

  const handleFileChange = (e, setter, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setter(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!foreground || !background) {
      alert("Please upload both images.");
      return;
    }

    const formData = new FormData();
    formData.append("foreground", foreground);
    formData.append("background", background);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      setFgFilename(res.data.foreground);
      setBgFilename(res.data.background);
    } catch (err) {
      alert("Upload failed.");
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!fgFilename || !bgFilename) {
      alert("Please upload images first.");
      return;
    }

    setLoading(true);
    setResultUrl("");

    try {
      const res = await axios.post("http://localhost:5000/api/generate", {
        foreground: fgFilename,
        background: bgFilename,
      });

      setResultUrl(`http://localhost:5000${res.data.imageUrl}`);
    } catch (err) {
      alert("Something went wrong during generation.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto mt-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {[
          { label: "Foreground", preview: fgPreview, setter: setForeground, setPreview: setFgPreview },
          { label: "Background", preview: bgPreview, setter: setBackground, setPreview: setBgPreview },
        ].map(({ label, preview, setter, setPreview }, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl border border-purple-200 shadow hover:shadow-lg transition"
          >
            <label className="block text-purple-700 font-medium mb-2">{label} Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setter, setPreview)}
              className="w-full text-sm file:bg-purple-100 file:text-purple-700 file:font-semibold file:border-0 file:px-4 file:py-2 file:rounded-full hover:file:bg-purple-200"
            />
            {preview && (
              <img src={preview} alt={label} className="mt-4 rounded-xl max-h-64 w-full object-contain" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={handleUpload}
          className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 shadow transition"
        >
          Upload
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 shadow transition disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </section>
  );
};

export default UploadSection;
