import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full h-[60px] bg-white border-b border-slate-200">
      <div className="max-w-screen-xl mx-auto h-full px-8 flex items-center">
        <Image
          src="/logo-large.png"
          alt="로고"
          width={151}
          height={40}
          priority
        />
      </div>
    </header>
  );
}
