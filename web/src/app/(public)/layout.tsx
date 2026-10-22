/**
 * Layout das páginas públicas.
 * Herda Header e Footer do layout raiz.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
