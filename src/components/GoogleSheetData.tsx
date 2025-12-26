import { useEffect } from "react";
import Papa from "papaparse";
import { parseWKT } from "../utils/parseWKT";
import { useMapData } from "../map/useMapData";

const GOOGLE_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

export default function GoogleSheetData() {
  const { setLines } = useMapData();

  useEffect(() => {
    Papa.parse(GOOGLE_URL, {
      download: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data as string[][];

        if (!rows.length) return;

        const NUM_COLUMNS = 14; // столбцы A–N

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

        console.log("Данные по столбцам A–N:", dataObjects);

        const geometries = rows.flatMap((row) => {
          const geom = row[9];
          return parseWKT(geom);
        });

        setLines(geometries);
      },
      error: console.error,
    });
  }, [setLines]);

  return null;
}
