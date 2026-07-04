import { useState } from 'react';
import { getMeta, useDataset } from '../data/DatasetContext';

interface EntityLogoProps {
  winner: string | null;
  size?: number;
}

export default function EntityLogo({ winner, size = 32 }: EntityLogoProps) {
  const dataset = useDataset();
  const [imgError, setImgError] = useState(false);
  const meta = getMeta(dataset, winner);

  if (!winner) {
    return (
      <span
        className="club-logo club-logo-empty"
        style={{ width: size, height: size }}
        aria-hidden
      >
        —
      </span>
    );
  }

  if (meta.flag) {
    return (
      <span
        className="club-logo club-logo-flag"
        style={{ width: size, height: size, fontSize: size * 0.82, lineHeight: 1 }}
        title={winner}
      >
        {meta.flag}
      </span>
    );
  }

  if (meta.logo && !imgError) {
    return (
      <img
        src={meta.logo}
        alt={`${winner} logo`}
        className="club-logo club-logo-img"
        style={{ width: size, height: size }}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className="club-logo club-logo-fallback"
      style={{
        width: size,
        height: size,
        backgroundColor: meta.color,
        fontSize: size * 0.28,
      }}
      title={winner}
    >
      {meta.shortName}
    </span>
  );
}
