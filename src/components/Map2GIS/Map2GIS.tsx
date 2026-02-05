import classNames from "classnames";
import styles from "./Map2GIS.module.css";
import { load } from "@2gis/mapgl";
import { useEffect, useRef } from "react";
import { useMapData } from "../../map/useMapData";

import { createTerraDrawWithUI } from "@2gis/mapgl-terra-draw";
import type { TerraDraw } from "terra-draw";
import "@2gis/mapgl-terra-draw/dist/mapgl-terra-draw.css";

const MAP_URL = import.meta.env.VITE_2GIS_URL as string;
const MAP_KEY = import.meta.env.VITE_2GIS_KEY as string;
const MAP_STYLE = import.meta.env.VITE_2GIS_STYLE as string;
const SEARCH_URL = import.meta.env.VITE_SEARCH_URL as string;

type MapGL = Awaited<ReturnType<typeof load>>;
type MapInstance = InstanceType<MapGL["Map"]>;
type PolylineInstance = InstanceType<MapGL["Polyline"]>;

type Props = {
  selectedPlace: MapSearchSelection | null;
};

const Map2GIS: React.FC<Props> = ({ selectedPlace }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const mapglRef = useRef<MapGL | null>(null);
  const polylinesRef = useRef<PolylineInstance[]>([]);

  const terraRef = useRef<TerraDraw | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const { lines, editMode } = useMapData();

  // Создание карты (один раз)
  useEffect(() => {
    let destroyed = false;

    load(MAP_URL).then((mapgl) => {
      if (destroyed || !containerRef.current) return;

      mapglRef.current = mapgl;

      mapRef.current = new mapgl.Map(containerRef.current, {
        center: [37.640655, 55.755335],
        zoom: 11,
        key: MAP_KEY,
        style: MAP_STYLE,
        preserveDrawingBuffer: true,
        enableTrackResize: true,
      });
    });

    return () => {
      destroyed = true;
      polylinesRef.current.forEach((p) => p.destroy());
      polylinesRef.current = [];
      cleanupRef.current?.();
      mapRef.current?.destroy();
    };
  }, []);

  // Отрисовка обычных линий (когда НЕ editMode)
  useEffect(() => {
    if (!mapRef.current || !mapglRef.current) return;
    if (editMode) return;

    polylinesRef.current.forEach((p) => p.destroy());
    polylinesRef.current = [];

    lines.forEach((line) => {
      const polyline = new mapglRef.current!.Polyline(mapRef.current!, {
        coordinates: line.geom,
        width: 3,
        color: "#FF3B30",
      });
      polylinesRef.current.push(polyline);
    });
  }, [lines, editMode]);

  // Включение / выключение режима редактирования
  useEffect(() => {
    if (!mapRef.current || !mapglRef.current) return;

    if (editMode) {
      // Удаляем обычные линии
      polylinesRef.current.forEach((p) => p.destroy());
      polylinesRef.current = [];

      if (!terraRef.current) {
        const { draw, cleanup } = createTerraDrawWithUI({
          map: mapRef.current,
          mapgl: mapglRef.current,
          controls: [
            "select",
            "point",
            "linestring",
            "polygon",
            "freehand",
            "circle",
            "angled-rectangle",
            "download",
            "clear",
            "color",
            "stroke-width",
            "point-cap",
          ],
        });

        terraRef.current = draw;

        // Добавляем линии через addFeatures
        const features = lines.map((line) => ({
          id: line.id,
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: line.geom,
          },
          properties: {
            mode: "linestring",
          },
        }));

        terraRef.current?.addFeatures(features);

        // Включаем select для редактирования
        terraRef.current.setMode("select");
        console.log("Переданные линии в редактор:", terraRef.current.getSnapshot());

        cleanupRef.current = cleanup;
        draw.start();
      }
    } else {
      cleanupRef.current?.();
      terraRef.current = null;
      cleanupRef.current = null;

      // Сброс курсора
      const container = mapRef.current.getContainer();
      container.style.cursor = "";
      const canvas = container.querySelector("canvas");
      if (canvas instanceof HTMLCanvasElement) {
        canvas.style.cursor = "";
      }
    }
  }, [editMode, lines]);

  useEffect(() => {
    console.log(selectedPlace);
    if (!selectedPlace || !mapRef.current) return;

    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `${SEARCH_URL}/3.0/items/geocode?q=${selectedPlace.address_name}&fields=items.point&key=${MAP_KEY}`
        );

        const data = await res.json();

        console.log(data);

        const item = data.result?.items?.[0];
        const point = item?.point;

        if (!point) return;

        mapRef.current?.setCenter(point.lon, point.lat);
        mapRef.current?.setZoom(16);
      } catch (e) {
        console.error("Ошибка получения координат:", e);
      }
    };

    fetchCoords();
  }, [selectedPlace]);

  return (
    <div
      ref={containerRef}
      className={classNames(styles.mapWrapper, "map-canvas-container")}
    />
  );
};

export default Map2GIS;
