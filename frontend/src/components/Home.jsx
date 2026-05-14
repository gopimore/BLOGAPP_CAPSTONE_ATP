function Home() {
  return (
    <div className="min-h-screen bg-[#1a120b] text-[#f8ead8] overflow-hidden">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
        
        {/* Left Content */}
        <div>
          <p className="uppercase tracking-[0.35em] text-[#d4a373] text-sm mb-5">
            Vintage Blogging Experience
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Write Stories <br />
            That Feel
            <span className="block italic text-[#ddb892]">
              Timeless
            </span>
          </h1>

          <p className="mt-8 text-lg text-[#e6ccb2] leading-relaxed">
            A cozy digital space where writers and readers connect through
            beautiful stories, creative ideas, and meaningful conversations.
            Inspired by old libraries, warm coffee shops, and classic journals.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <button className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-8 py-4 rounded-full font-semibold shadow-xl transition duration-300">
              Explore Blogs
            </button>

            <button className="border border-[#ddb892] hover:bg-[#ddb892] hover:text-black px-8 py-4 rounded-full font-semibold transition duration-300">
              Start Writing
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-14">
            <div>
              <h2 className="text-3xl font-bold text-[#ddb892]">10K+</h2>
              <p className="text-[#e6ccb2]">Readers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#ddb892]">2K+</h2>
              <p className="text-[#e6ccb2]">Stories</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-[#ddb892]">500+</h2>
              <p className="text-[#e6ccb2]">Authors</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="relative flex justify-center">
          <div className="bg-[#2d1e16] border-4 border-[#c89b5b] p-5 rounded-[30px] shadow-2xl rotate-2 hover:rotate-0 transition duration-500">
            <img
              src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
              alt="Books"
              className="rounded-2xl h-500px w-400px object-cover"
            />

            <div className="mt-6">
              <h2 className="text-3xl font-bold text-[#f5deb3]">
                Every Story Has Soul
              </h2>

              <p className="mt-3 text-[#e6ccb2]">
                Experience blogging with elegant vintage aesthetics and warm
                storytelling vibes.
              </p>
            </div>
          </div>

          {/* Decorative Effects */}
          <div className="absolute top-0 left-10 w-32 h-32 bg-[#ddb892]/20 rounded-full blur-3xl"></div>

          <div className="absolute bottom-0 right-10 w-40 h-40 bg-[#c89b5b]/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;