// Badge kecil untuk menampilkan satu skill, dipakai berulang di banyak tempat.
export default function SkillBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-node-line bg-node-panel px-3 py-1 text-xs font-mono text-node-accent">
      {label}
    </span>
  );
}
