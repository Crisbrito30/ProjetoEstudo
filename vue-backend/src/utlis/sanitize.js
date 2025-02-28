export const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n/g, " ");
  };
  
  export const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
  
    return Array.isArray(obj)
      ? obj.map(sanitizeObject)
      : Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [key, typeof value === 'string' ? sanitizeString(value) : value])
        );
  };
  