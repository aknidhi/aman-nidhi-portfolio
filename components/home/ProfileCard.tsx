type ProfileCardProps = {
  imageUrl: string | null;
  imageAlt: string;
  cardName: string;
  cardRole: string;
  cardSubtitle: string;
};

export default function ProfileCard({
  imageUrl,
  imageAlt,
  cardName,
  cardRole,
  cardSubtitle,
}: ProfileCardProps) {
  return (
    <div className="public-profile-cinematic group relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-[2rem] border border-white/15 bg-transparent">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-transparent">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-black/20 text-3xl font-medium text-white/45">
            AN
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
      <div className="public-profile-light" />
      <div className="public-profile-border rounded-[2rem]" />

      <div className="absolute bottom-7 left-7 right-7 z-[6]">
        <p className="text-xs uppercase tracking-[0.2em] text-white/90">
          {cardName}
        </p>

        <p className="mt-2 text-xs leading-5 text-white/70">
          {cardRole}
          <br />
          {cardSubtitle}
        </p>
      </div>

      <span className="absolute bottom-7 right-7 z-[6] text-xs text-white/40">
        01
      </span>
    </div>
  );
}
