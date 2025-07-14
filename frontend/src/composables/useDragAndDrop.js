import { ref } from 'vue';

export default function useDragAndDrop() {
    const draggedItem = ref(null);

    const onDragStart = (item) => {
        draggedItem.value = item;
    };

    const onDragOver = (event) => {
        event.preventDefault();
    };

    const onDrop = (list) => {
        if (draggedItem.value) {
            // Handle the drop logic here
            console.log(`Dropped ${draggedItem.value.title} to ${list.title}`);
            draggedItem.value = null;
        }
    };

    return {
        draggedItem,
        onDragStart,
        onDragOver,
        onDrop
    };
}