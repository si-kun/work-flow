export const formatTime = (hours: number, minutes: number): string => {
  const h = hours.toString().padStart(2, "0")
  const m = minutes.toString().padStart(2, "0")

  return `${h}:${m}`
}

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

  export const restOneHour = (timeStr: string): string => {
    const minutes = timeToMinutes(timeStr)
    const newMinutes = minutes + 1

    const hours = Math.floor(newMinutes / 60) % 24
    const mins = newMinutes % 60

    return formatTime(hours, mins)
  }