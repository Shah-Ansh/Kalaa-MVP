import { useState } from 'react';
import axios from 'axios';
import { Upload, Sparkles, BadgeCheck, ImagePlus } from 'lucide-react';

const SERVER = 'http://10.2.132.189:5000';

const App = () => {
  const [foreground, setForeground] = useState(null);
  const [background, setBackground] = useState(null);
  const [fgFilename, setFgFilename] = useState('');
  const [bgFilename, setBgFilename] = useState('');
  const [result, setResult] = useState({ main: '', suggestions: [], code: '' });
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPattern, setShowPattern] = useState(false); // new state

  const handleUpload = async () => {
    if (!foreground || !background) {
      alert('Please select both images.');
      return;
    }

    const formData = new FormData();
    formData.append('foreground', foreground);
    formData.append('background', background);

    try {
      const res = await axios.post(`${SERVER}/api/upload`, formData);
      setFgFilename(res.data.foreground);
      setBgFilename(res.data.background);
      setUploadSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleGenerate = async () => {
    if (!fgFilename || !bgFilename) {
      alert('Upload images first.');
      return;
    }

    setLoading(true);
    setResult({ main: '', suggestions: [], code: '' });

    try {
      const res = await axios.post(`${SERVER}/api/generate`, {
        foreground: fgFilename,
        background: bgFilename,
      });

      setResult({
        main: res.data.main,
        suggestions: res.data.suggestions || [],
        code: res.data.code || 'N/A',
      });
    } catch (err) {
      alert('Something went wrong.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f3efea] min-h-screen text-[#2e2e2e] font-['Playfair_Display']">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white shadow z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/kalaa-logo.svg" alt="Kalaa Logo" className="w-12 h-12" />
          <span className="text-lg font-bold text-[#ca8655] tracking-wide">Kalaa</span>
        </div>
        <div className="hidden md:flex flex-col items-center absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-xl md:text-2xl font-bold text-[#111] tracking-widest">
            <span className="text-[#ca8655]">Kalaa</span> Studio
          </h1>
          <p className="text-xs text-[#777] tracking-wide font-light italic">
            Your Style, Your Heritage
          </p>
        </div>
        <div className="w-12 h-12" />
      </nav>

      <main className="pt-24 max-w-6xl mx-auto px-4 md:px-8 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#3d3d3d] mb-10">
          Customize Your Look
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center">
            <img
              src={showPattern ? "/base-pattern-1.jpeg" : "/model.png"}
              alt="Model"
              className="rounded-3xl shadow-xl object-cover max-h-[600px] w-full"
            />
            <button
              onClick={() => setShowPattern(!showPattern)}
              className="mt-4 text-sm bg-[#ca8655] hover:bg-[#b27040] text-white px-4 py-2 rounded-full transition"
            >
              {showPattern ? 'Show Model' : 'Show Pattern'}
            </button>
          </div>

          {/* Upload Section */}
          <div className="bg-white shadow-lg p-6 rounded-2xl border border-[#eee] flex flex-col justify-between min-h-[500px]">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#4b4b4b]">Upload Your Style</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Background Texture I Liked
                  </label>
                  <label className="flex items-center gap-3 bg-[#f7f5f3] hover:bg-[#ece8e4] transition cursor-pointer px-4 py-2 rounded-lg border border-dashed border-gray-400 text-gray-700">
                    <ImagePlus size={20} />
                    <span>{foreground ? foreground.name : 'Choose File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setForeground(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {foreground && (
                    <img
                      src={URL.createObjectURL(foreground)}
                      alt="Preview"
                      className="mt-2 h-32 w-auto rounded-lg object-cover border"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Design Texture I Liked
                  </label>
                  <label className="flex items-center gap-3 bg-[#f7f5f3] hover:bg-[#ece8e4] transition cursor-pointer px-4 py-2 rounded-lg border border-dashed border-gray-400 text-gray-700">
                    <ImagePlus size={20} />
                    <span>{background ? background.name : 'Choose File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBackground(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  {background && (
                    <img
                      src={URL.createObjectURL(background)}
                      alt="Preview"
                      className="mt-2 h-32 w-auto rounded-lg object-cover border"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4 items-center justify-between">
              <button
                onClick={handleUpload}
                className={`w-1/2 py-2 rounded-full text-white font-semibold transition ${
                  uploadSuccess ? 'bg-green-600' : 'bg-[#ca8655] hover:bg-[#b27040]'
                } flex items-center justify-center gap-2`}
              >
                <Upload size={18} />
                {uploadSuccess ? 'Uploaded' : 'Upload'}
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-1/2 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                {loading ? 'Generating...' : 'Generate Look'}
              </button>
            </div>
          </div>
        </div>

        {/* MAIN RESULT */}
        {result.main && (
          <div className="mt-20 px-4 md:px-16 py-10 bg-white border border-[#eee] rounded-3xl shadow-xl max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-semibold mb-4 text-[#222]">Your Generated Outfit</h3>
            <img
              src={`${SERVER}${result.main}`}
              alt="Generated"
              className="mx-auto rounded-xl shadow-md max-h-[500px] w-full object-contain"
            />
            <p className="text-gray-700 mt-3 text-sm flex items-center justify-center gap-2">
              <BadgeCheck className="text-green-600 w-4 h-4" />
              Design Code: <span className="font-bold ml-1">{result.code}</span>
            </p>
          </div>
        )}

        {/* CATALOGUE SUGGESTIONS */}
        {result.suggestions.length > 0 && (
          <div className="mt-16 text-center">
            <h4 className="text-2xl font-bold mb-6 text-[#3a3a3a]">From Our Catalogue</h4>
            <div className="flex justify-center gap-8 flex-wrap">
              {result.suggestions.map((img, idx) => {
                const parts = img.split('/');
                const file = parts[parts.length - 1];
                const code = file.split('.')[0];

                return (
                  <div key={idx} className="w-56">
                    <img
                      src={`${SERVER}${img}`}
                      className="rounded-2xl shadow-md h-72 object-cover hover:scale-105 transition-all duration-200 w-full"
                      alt={`Catalogue ${idx + 1}`}
                    />
                    <p className="text-sm mt-2 text-gray-600">
                      Code: <span className="font-semibold">{code}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
