function clampScore(value: number): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.trunc(numeric)));
}

export function ScoreGauge({
  score,
  label = "Índice Ponderado de Gestão",
}: {
  score: number;
  label?: string;
}) {
  const gestao = clampScore(score);
  const gradientId = "score-gauge-gradient";
  const radius = 72;
  const centerX = 100;
  const centerY = 96;
  const circumference = Math.PI * radius;
  const progress = (gestao / 100) * circumference;
  const pointerAngle = Math.PI - (gestao / 100) * Math.PI;
  const pointerX = centerX + Math.cos(pointerAngle) * (radius - 4);
  const pointerY = centerY - Math.sin(pointerAngle) * (radius - 4);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 200 120"
        className="h-auto w-full max-w-[14rem]"
        role="img"
        aria-label={`${label}: ${gestao} de 100 pontos`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          className="text-muted"
        />
        <path
          d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
        />
        <line
          x1={centerX}
          y1={centerY}
          x2={pointerX}
          y2={pointerY}
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="text-foreground"
        />
        <circle cx={centerX} cy={centerY} r="4.5" className="fill-foreground" />
        <text
          x={centerX}
          y={centerY - 18}
          textAnchor="middle"
          className="fill-foreground text-[1.65rem] font-bold"
        >
          {gestao}
        </text>
        <text
          x={centerX}
          y={centerY + 2}
          textAnchor="middle"
          className="fill-muted-foreground text-[0.7rem]"
        >
          / 100
        </text>
      </svg>
      <p className="text-center text-xs text-muted-foreground">
        com base em assiduidade, alinhamento de voto e transparência.
      </p>
    </div>
  );
}
