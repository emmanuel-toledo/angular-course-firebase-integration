

/**
 * This function convert a Firebase snapshoot to a generic object or array.
 * It is a type safe function.
 * @param results Firebase snapshoot
 * @returns Specified model.
 */
export function convertSnaps<T>(results) {
    return <T[]>results.docs.map(snap => {
        return {
            id: snap.id,
            ...<any>snap.data() // Parse the data to object.
        }
    });
}
