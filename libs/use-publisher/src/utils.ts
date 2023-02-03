export const validateDuplicateSourceIds = (sourceId: string, allSourceIds: string[]) => {
  let dedupedSourceId = sourceId;

  if (allSourceIds.includes(sourceId)) {
    dedupedSourceId = sourceId.replace(/\((?<dupeCounter>\d+)\)$|$/, (match, dupeCounter) => {
      if (!match) {
        return ' (2)';
      }

      return `(${parseInt(dupeCounter, 10) + 1})`;
    });

    dedupedSourceId = validateDuplicateSourceIds(dedupedSourceId, allSourceIds);
  }

  return dedupedSourceId;
};
