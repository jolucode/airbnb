const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t py-8 px-4 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-airbnb-gray">
        <div className="flex flex-wrap justify-center gap-4">
          <span>© 2026 Airbnb, Inc.</span>
          <span className="hover:underline cursor-pointer">Privacidad</span>
          <span className="hover:underline cursor-pointer">Términos</span>
          <span className="hover:underline cursor-pointer">Mapa del sitio</span>
        </div>
        <div className="flex items-center gap-6 font-semibold text-slate-800">
          <span className="flex items-center gap-2 cursor-pointer hover:underline">
            Español (MX)
          </span>
          <span className="cursor-pointer hover:underline">
            $ USD
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
