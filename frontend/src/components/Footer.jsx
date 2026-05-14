function Footer() {
  return (
    <footer className="bg-[#1a120b] border-t border-[#3b2a20] text-[#e6ccb2]">
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Brand */}
          <div>
            <h1 className="text-3xl font-extrabold text-[#ddb892] tracking-wide mb-4">
              VintageBlog
            </h1>

            <p className="text-[#b08968] leading-relaxed">
              A timeless blogging platform where stories,
              creativity, and ideas come alive through
              elegant vintage aesthetics.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h2 className="text-2xl font-bold text-[#ddb892] mb-4">
              Explore
            </h2>

            <ul className="space-y-3 text-[#e6ccb2]">
              <li className="hover:text-[#ddb892] transition duration-300 cursor-pointer">
                Home
              </li>

              <li className="hover:text-[#ddb892] transition duration-300 cursor-pointer">
                Articles
              </li>

              <li className="hover:text-[#ddb892] transition duration-300 cursor-pointer">
                Authors
              </li>

              <li className="hover:text-[#ddb892] transition duration-300 cursor-pointer">
                Community
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-2xl font-bold text-[#ddb892] mb-4">
              Connect
            </h2>

            <p className="text-[#b08968] mb-2">
              Email: vintageblog@blog.com
            </p>

            <p className="text-[#b08968] mb-2">
              Hyderabad, India
            </p>

            <div className="flex gap-4 mt-5">
              
              <button className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-4 py-2 rounded-full font-semibold transition duration-300">
                Instagram
              </button>

              <button className="bg-[#4a3728] hover:bg-[#5c4331] px-4 py-2 rounded-full transition duration-300">
                Twitter
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#3b2a20] mt-10 pt-6 text-center text-[#b08968]">
          
          <p className="text-sm tracking-wide">
            © 2026 VintageInk • Crafted with passion for writers & readers
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;