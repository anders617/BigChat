/* eslint-disable import/prefer-default-export */
export function updateArrayWithChanges(array, changes) {
    changes.forEach(change => {
        if (change.type === 'added') {
            array.splice(change.newIndex, 0, {
                id: change.doc.id,
                ...change.doc.data(),
            });
        }
        if (change.type === 'removed') {
            array.splice(change.oldIndex, 1);
        }
        if (change.type === 'modified') {
            array.splice(change.oldIndex, 1);
            array.splice(change.newIndex, 0, {
                id: change.doc.id,
                ...change.doc.data(),
            });
        }
    });
}