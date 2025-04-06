const Navbar = () => {
  return (
    <nav className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-wide text-[#115e59] font-['Playfair_Display']">
          Kalaa<span className="text-[#d97706]">.</span>
        </h1>
        <p className="text-sm text-gray-500 italic">Art of Dressing with AI</p>
      </div>
    </nav>
  );
};

export default Navbar;