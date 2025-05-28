export const validateEmail=(email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
}

export const addThousandsSeperator = (num) => {
    if (num == null || isNaN(num)) return "";
  
    const [integratedPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = integratedPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
    return fractionalPart
      ? `${formattedInteger}.${fractionalPart}`
      : formattedInteger;
  };
  