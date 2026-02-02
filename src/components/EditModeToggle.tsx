import { useMapData } from "../map/useMapData";

export default function EditModeToggle() {
  const { editMode, setEditMode } = useMapData();

  return (
    <button onClick={() => setEditMode((prev) => !prev)}>
      {editMode ? "Выключить" : "Редактировать"}
    </button>
  );
}