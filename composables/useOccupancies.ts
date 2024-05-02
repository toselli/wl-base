export default {
    stringify(occupancies) {
        return occupancies ? occupancies.map(occ => `${occ.Adults};${occ.Children}*${occ.ChildrenAges.join(',')}*`).join('|') : ''
    },

    parse(occStr:string) {
        if(!occStr) return;
        const array = occStr.split('|').map(room => {
            const [adults, childrenAgesStr] = room.split(';');
            const [children, childrenAges] = childrenAgesStr ? childrenAgesStr.split('*') : ['', ''];

            return {
                Adults: parseInt(adults),
                Children: parseInt(children),
                ChildrenAges: childrenAges ? childrenAges.split(',').map(x => parseInt(x)) : [],
                Infants: 0,
                Visible: true,
                SeniorAges:  [],
                AdultsAges: Array(parseInt(adults[0])).fill(30)
            };
        });
        return array;
    }
}