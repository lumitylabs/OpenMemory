export const relativeTime = (timestamp:number) => {
    const adjustedTimestamp = timestamp * 1000;
    const now = Date.now();
    const diffInMilliseconds = now - adjustedTimestamp;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;
    const diffInWeeks = diffInDays / 7;
    const diffInMonths = diffInDays / 30;  // Approximate conversion
    const diffInYears = diffInDays / 365;  // Approximate conversion
  
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays <= 6) {
      return `${Math.floor(diffInDays)} days ago`;
    } else if (diffInWeeks <= 3) {
      return `${Math.floor(diffInWeeks)} weeks ago`;
    } else if (diffInMonths < 12) {
      return `${Math.floor(diffInMonths)} months ago`;
    } else {
      return `${Math.floor(diffInYears)} years ago`;
    }
  }

  
  export const convertTimestampToHoursMinutes = (timestamp: number): string => {
    const date = new Date(timestamp*1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}h${String(minutes).padStart(2, '0')}`;
  };


  export const deduplicateArray = (array:any, key:any) => {
    const map = new Map();
    array.forEach((item:any) => {
      if (!map.has(item[key])) map.set(item[key], item);
    });
    return Array.from(map.values());
  };
  
  export const formatDate = (date:any) => {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  const monthNames = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];