import { SectionShell } from "@/components/ui/SectionShell";
import { proofs } from "@/content/proofs";

export function ProofSection() {
  if (proofs.length === 0) return null;

  return (
    <SectionShell id="proofs" title="Доказательства в цифрах и проектах">
      <ul>
        {proofs.map((proof) => (
          <li key={proof.id}>
            <strong>{proof.value}</strong> {proof.label}
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

