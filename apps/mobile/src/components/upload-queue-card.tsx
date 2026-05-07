import { Text, View } from 'react-native';

import type { ExamDocument } from '@mejoy/api-contracts/mobile';
import { colors, radii, shadows, spacing, typography } from '@mejoy/design-tokens';
import { ClinicalStatusBadge } from '@/components/clinical-status-badge';

export function UploadQueueCard({
  document,
}: {
  document: ExamDocument;
}) {
  const tone = document.status === 'uploaded' ? 'good' : 'attention';

  return (
    <View
      style={{
        gap: spacing.md,
        borderRadius: radii.lg,
        borderCurve: 'continuous',
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xl,
        boxShadow: shadows.soft,
      }}
    >
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md }}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text selectable style={{ color: colors.textStrong, fontSize: typography.bodyStrong, fontWeight: '700' }}>
            {document.fileName}
          </Text>
          <Text selectable style={{ color: colors.textSoft, fontSize: typography.caption }}>
            {document.mimeType} · {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <ClinicalStatusBadge label={document.status === 'uploaded' ? 'Pronto' : 'Na fila'} tone={tone} />
      </View>
      <Text selectable style={{ color: colors.textMuted, fontSize: typography.caption, lineHeight: 20 }}>
        {document.summaryText || document.reviewHint}
      </Text>
    </View>
  );
}
