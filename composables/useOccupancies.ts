export default {
    stringify(occupancies) {
        return occupancies ? occupancies.map(occ => `${occ.Adults};${occ.Children};*${occ.ChildrenAges.join(',')}*;~${occ.AdultsAges.join(',')}~`).join('|') : ''
    },

    parse(occupancies: string) {
        if (!occupancies) return null;

        const rooms = occupancies.split('|');
      
        return rooms.map(room => {
          const [adults, children, childrenAgesStr, adultsAgesStr] = room.split(';');
      
          const childrenAges = childrenAgesStr ? childrenAgesStr.substring(1, childrenAgesStr.length - 1).split(',').map(age => parseInt(age, 10)) : [];
          const adultsAges = adultsAgesStr ? adultsAgesStr.substring(1, adultsAgesStr.length - 1).split(',').map(age => parseInt(age, 10)) : [];
      
          return {
            Adults: parseInt(adults),
            Children: parseInt(children),
            ChildrenAges: parseInt(children) > 0 ? childrenAges : [],
            AdultsAges: parseInt(adults) > 0 ? adultsAges : []
          };
        });
    }
}              