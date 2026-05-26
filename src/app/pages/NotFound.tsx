import { Link } from 'react-router';

export function NotFound() {
  return (
    <section className="min-h-[70vh] grid place-items-center px-6 text-center">
      <div>
        <div className="text-7xl font-black text-gradient">404</div>
        <h2 className="mt-3 display-font text-6xl text-[#1f1710]">This block doesn't exist</h2>
        <p className="text-[#745f49] mt-2">The page you're looking for has been mined out.</p>
        <Link to="/" className="inline-flex mt-6 px-6 h-11 items-center rounded-xl bg-[#ffd028] text-[#1f1710] font-black outline-panel">Return Home</Link>
      </div>
    </section>
  );
}
