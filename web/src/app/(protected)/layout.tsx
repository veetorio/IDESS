/**
 * Layout das páginas protegidas (requer autenticação).
 * A proteção é feita pelo middleware — este layout só
 * é renderizado se o usuário estiver autenticado.
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
