export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-screen bg-[#F7F8F0] px-6 py-16 text-center text-slate-600">
      {message}
    </div>
  );
}
