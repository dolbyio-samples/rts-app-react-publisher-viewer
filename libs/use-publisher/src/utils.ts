/**
 * Find duplicated sourceId in allSourceIds, if there is duplication, add a number as postfix.
 * @param sourceId
 * @param allSourceIds
 * @returns adjusted source id
 * e.g.
 * if sourceId is `A`, allSourceIds are `A`, `B`, it will return `A (2)`.
 * if sourceId is `A`, allSourceIds are `A`, `A (2)`, `B`, it will return `A (3)`
 */
export const adjustDuplicateSourceIds = (sourceId: string, allSourceIds: string[]) => {
  let dedupedSourceId = sourceId;

  if (allSourceIds.includes(sourceId)) {
    dedupedSourceId = sourceId.replace(/\((?<dupeCounter>\d+)\)$|$/, (match, dupeCounter) => {
      if (!match) {
        return ' (2)';
      }

      return `(${parseInt(dupeCounter, 10) + 1})`;
    });

    dedupedSourceId = adjustDuplicateSourceIds(dedupedSourceId, allSourceIds);
  }

  return dedupedSourceId;
};
