import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full h-[60px] bg-white border-b border-slate-200 sticky top-0 z-50">
      {" "}
      {/* sticky, top-0, z-50 추가 (선택 사항) */}
      <div className="max-w-screen-xl mx-auto h-full px-8 flex items-center">
        <Link href="/" aria-label="홈으로 이동">
          <Image
            src="/logo-large.png"
            alt="로고 - 홈으로 이동"
            width={151}
            height={40}
            priority
            className="cursor-pointer"
          />
        </Link>
      </div>
    </header>
  );
}
