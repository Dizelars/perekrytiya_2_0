import { useEffect } from "react";
import Papa from "papaparse";
import { parseWKT } from "../utils/parseWKT";
import { useMapData } from "../map/useMapData";
import { isDateInRange } from "../utils/isDateInRange";

const GOOGLE_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

type Props = {
  selectedDate: string | null;
};

export default function GoogleSheetData({ selectedDate }: Props) {
  const { setLines, setEvents } = useMapData();

  useEffect(() => {
    Papa.parse(GOOGLE_URL, {
      download: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data as string[][];

        if (!rows.length) return;

        const NUM_COLUMNS = 14; // столбцы A–N

        // Парсим строки в объекты
        const dataObjects = rows.map((row) => {
          const fullRow = [...row];
          while (fullRow.length < NUM_COLUMNS) fullRow.push("");

          // Возвращаем объект по индексам столбцов
          return {
            uuid: fullRow[0],
            start_date: fullRow[1],
            end_date: fullRow[2],
            confirmed: fullRow[3],
            worker: fullRow[4],
            work: fullRow[5],
            address: fullRow[6],
            comment: fullRow[7],
            okrug_name: fullRow[8],
            geom: fullRow[9],
            event_type_name: fullRow[10],
            created_at: fullRow[11],
            updated_at: fullRow[12],
            delta: fullRow[13],
          };
        });

        // console.log("Данные по столбцам A–N:", dataObjects);

        // Фильтруем по выбранной дате
        const filteredDate = selectedDate
          ? dataObjects.filter((item) =>
              isDateInRange(
                selectedDate,
                item.start_date,
                item.end_date
              )
            )
          : dataObjects;

        // Группируем мероприятия по work (название мероприятия)
        const groupedEvents = filteredDate.reduce((acc, item) => {
          const key = item.work;

          if (!acc[key]) {
            acc[key] = {
              id: key, // уникальный идентификатор мероприятия
              work: item.work,
              geoms: [] as string[],
            };
          }

          acc[key].geoms.push(item.geom);
          return acc;
        }, {} as Record<string, { id: string; work: string; geoms: string[] }>);

        const eventsArray = Object.values(groupedEvents);

        // Все линии для карты
        const geometries = eventsArray.flatMap((event) =>
          event.geoms.flatMap(parseWKT)
        );

        // Сохраняем в контексте
        setLines(geometries);
        setEvents(eventsArray);
      },
      error: console.error,
    });
  }, [selectedDate, setLines, setEvents]);

  return null;
}
