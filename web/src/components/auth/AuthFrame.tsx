import Image from "next/image";
import Link from "next/link";

interface AuthFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthFrame({
  eyebrow,
  title,
  description,
  children,
}: AuthFrameProps) {
  return (
    <div className="grid min-h-screen bg-base md:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden bg-primary md:flex md:flex-col md:justify-between md:p-10 lg:p-14">
        <Image
          src="/fotos/back(1).jpeg"
          alt=""
          fill
          sizes="(max-width: 768px) 0px, 52vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/65 to-primary-dark/95" />
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-white focus-visible:rounded-sm"
          >
            <Image src="/logoWhite.png" alt="" width={44} height={44} />
            <span className="text-sm font-bold leading-tight">
              ETTORE SEBASTIANINI
              <span className="mt-1 block text-xs font-normal text-white/75">
                Instituto de Desenvolvimento Social Sustentável
              </span>
            </span>
          </Link>
        </div>
        <div className="relative z-10 max-w-xl pb-10">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-green-light">
            {eyebrow}
          </p>
          <p className="font-serif text-4xl leading-tight text-white lg:text-5xl">
            Gente que se encontra. Comunidades que avançam.
          </p>
          <p className="mt-5 max-w-md text-base leading-7 text-white/80">
            Acompanhe iniciativas, participe dos eventos e caminhe junto com o
            Instituto.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          São Luís, Maranhão · Brasil
        </p>
      </aside>

      <div className="flex min-h-screen flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-3 text-primary md:hidden"
          >
            <Image src="/logo.png" alt="" width={40} height={40} />
            <span className="text-xs font-bold leading-tight">
              ETTORE SEBASTIANINI
              <span className="mt-1 block font-normal text-neutral-600">
                Instituto de Desenvolvimento Social Sustentável
              </span>
            </span>
          </Link>

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-dark">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-primary sm:text-4xl">
              {title}
            </h1>
            <p className="mt-3 leading-6 text-neutral-600">{description}</p>
          </div>

          <div className="border-t border-neutral-200 pt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
