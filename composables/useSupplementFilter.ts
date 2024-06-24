import { supplementGroups } from '@/utils/supplementGroups';

export function useSupplementFilter() {
    const store = useStaysStore();
    const avail = computed(() => store.avail);

    const supplementOptions = computed(() => {
        const supplementSet = new Set();
        const ungroupedSupplements = new Set();

        avail.value.forEach(result => {
            const allDescriptions = [
                ...result.Price.PVP.IncludedSupplements.map(supplement => supplement.Description),
                ...result.Price.PVP.Boards.map(board => board.Description)
            ];

            const priorityMap = new Map();

            allDescriptions.forEach(description => {
                const lowerCaseDescription = description.toLowerCase();

                let matched = false;
                for (const group in supplementGroups) {
                    const groupData = supplementGroups[group];
                    if (groupData.items.map(item => item.toLowerCase()).includes(lowerCaseDescription)) {
                        matched = true;
                        if (!priorityMap.has(group) || groupData.priority < priorityMap.get(group)) {
                            priorityMap.set(group, groupData.priority);
                        }
                    }
                }
                if (!matched) {
                    ungroupedSupplements.add(description);
                }
            });

            const highestPriorityGroup = Array.from(priorityMap.entries()).sort((a, b) => a[1] - b[1])[0]?.[0];

            if (highestPriorityGroup) {
                supplementSet.add(highestPriorityGroup);
            }
        });

        ungroupedSupplements.forEach(supplement => supplementSet.add(supplement));

        return ['Mostrar todos', ...Array.from(supplementSet).sort()];
    });

    return { supplementOptions };
}
