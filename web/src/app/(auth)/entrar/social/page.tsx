import type { Metadata } from "next";
import { SocialLoginCompletion } from "@/components/auth/SocialLoginCompletion";

export const metadata: Metadata = {
  title: "Concluir acesso",
  robots: { index: false, follow: false },
};

interface SocialCallbackPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SocialCallbackPage({
  searchParams,
}: SocialCallbackPageProps) {
  const params = await searchParams;
  const ticket = typeof params.ticket === "string" ? params.ticket : "";
  const redirect = typeof params.redirect === "string" ? params.redirect : "/";
  const novoCadastro = params.novo === "true";

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-12">
      <SocialLoginCompletion
        ticket={ticket}
        redirect={redirect}
        novoCadastro={novoCadastro}
      />
    </div>
  );
}
