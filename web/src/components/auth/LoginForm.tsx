"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ----------------------
// Schema de validação
// ----------------------

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("Informe um e-mail válido"),
  senha: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ----------------------
// Componente
// ----------------------

interface LoginFormProps {
  redirect?: string;
}

export function LoginForm({ redirect = "/" }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  // Prop tem prioridade; fallback para searchParam
  const destino = redirect !== "/" ? redirect : (searchParams.get("redirect") ?? "/");
  const erroSocial = searchParams.get("erro");
  const googleLoginHabilitado =
    process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === "true";
  const facebookLoginHabilitado =
    process.env.NEXT_PUBLIC_FACEBOOK_LOGIN_ENABLED === "true";
  const apiUrl =
    (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/+$/, "");
  const queryRedirect = `?redirect=${encodeURIComponent(destino)}`;

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (dados: LoginFormData) => {
    setErroServidor(null);
    try {
      await login({ email: dados.email, senha: dados.senha });
      router.push(destino);
    } catch (err) {
      setErroServidor(
        err instanceof Error ? err.message : "Erro ao fazer login. Tente novamente."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
      aria-label="Formulário de login"
    >
      {/* Erro do servidor */}
      {erroServidor && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {erroServidor}
        </div>
      )}
      {!erroServidor && erroSocial && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {erroSocial === "email-nao-verificado"
            ? "Não foi possível vincular automaticamente: o provedor não confirmou o e-mail. Entre com sua senha."
            : erroSocial === "login-social-indisponivel"
              ? "Não foi possível concluir o login social. Confira os dados da conta ou use seu e-mail e senha."
              : "A autenticação social foi cancelada ou não pôde ser concluída. Tente novamente."}
        </div>
      )}

      {/* E-mail */}
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="seu@email.com"
          erro={errors.email?.message}
          {...register("email")}
        />
        {errors.email && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Senha */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="senha">Senha</Label>
        </div>
        <div className="relative">
          <Input
            id="senha"
            type={senhaVisivel ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            erro={errors.senha?.message}
            className="pr-10"
            {...register("senha")}
          />
          <button
            type="button"
            onClick={() => setSenhaVisivel((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
          >
            {senhaVisivel ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.senha && (
          <p role="alert" className="text-xs text-red-600 mt-1">
            {errors.senha.message}
          </p>
        )}
      </div>

      {/* Botão de submit */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
      >
        {isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>

      {(googleLoginHabilitado || facebookLoginHabilitado) && (
        <>
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <span className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-neutral-500">
                ou continue com
              </span>
            </div>
          </div>

          <div className={`grid gap-3 ${googleLoginHabilitado && facebookLoginHabilitado ? "sm:grid-cols-2" : ""}`}>
            {googleLoginHabilitado && (
              <a
                href={`${apiUrl}/oauth2/authorization/google${queryRedirect}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="font-bold text-base" aria-hidden="true">G</span>
                Google
              </a>
            )}
            {facebookLoginHabilitado && (
              <a
                href={`${apiUrl}/oauth2/authorization/facebook${queryRedirect}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="text-base font-bold text-blue" aria-hidden="true">f</span>
                Facebook
              </a>
            )}
          </div>
        </>
      )}

      {/* Link para cadastro */}
      <p className="text-center text-sm text-neutral-600">
        Não tem uma conta?{" "}
        <Link
          href="/cadastrar"
          className="font-semibold text-blue underline-offset-4 hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
