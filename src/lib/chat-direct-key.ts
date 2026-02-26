export function createDirectKey(userAId: string, userBId: string): string {
  return [userAId, userBId].sort((a, b) => a.localeCompare(b)).join("_");
}
