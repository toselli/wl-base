export default function useTagColor() {
  function getTagColor(id: number) {
    const colorMap = {
      1: "green-darken-1 ",   
      2: "amber-darken-4 ",
      3: "blue-darken-1",
      4: 'teal-darken-1',
      5: 'red',
      6: 'red'
    };

    return colorMap[id] || "grey"; 
  }

  return {
    getTagColor
  };
}
