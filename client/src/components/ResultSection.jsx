const ResultSection = ({ resultUrl }) => {
    if (!resultUrl) return null;
  
    return (
      <section className="mt-12 text-center">
        <h3 className="text-2xl font-semibold text-purple-700 mb-4">Generated Image</h3>
        <div className="max-w-3xl mx-auto px-4">
          <img src={resultUrl} alt="Result" className="rounded-xl shadow-lg mx-auto max-h-[500px]" />
        </div>
      </section>
    );
  };
  
  export default ResultSection;
  