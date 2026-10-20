interface Props {
  onRetry: () => void;
}

export function ErrorBoundaryFallback({ onRetry }: Props) {
  return (
    <div>
      <h1>Desculpe... Ocorreu um erro</h1>
      <p>Não foi possível carregar a página.</p>
      <button type="button" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}
