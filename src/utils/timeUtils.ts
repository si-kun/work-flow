export const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":");
    return Number(hours) * 60 + Number(minutes);
  };
  
  export const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
  
    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`;
    } else if (hours > 0) {
      return `${hours}時間`;
    } else {
      return `${mins}分`;
    }
  };