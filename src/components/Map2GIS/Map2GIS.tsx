import classNames from "classnames";
import styles from "./Map2GIS.module.css";
import { load } from "@2gis/mapgl";
import { useEffect, useRef } from "react";
import { useMapData } from "../../map/useMapData";

const MAP_URL = import.meta.env.VITE_2GIS_URL;
const MAP_KEY = import.meta.env.VITE_2GIS_KEY;
const MAP_STYLE = import.meta.env.VITE_2GIS_STYLE;

type MapGL = Awaited<ReturnType<typeof load>>;
type PolylineInstance = InstanceType<MapGL["Polyline"]>;
type MapInstance = InstanceType<MapGL["Map"]>;

const Map2GIS = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const mapglRef = useRef<MapGL | null>(null);
  const polylinesRef = useRef<PolylineInstance[]>([]);

  const { lines } = useMapData();

  useEffect(() => {
    let destroyed = false;

    load(MAP_URL).then((mapgl) => {
      if (destroyed || !containerRef.current) return;

      mapglRef.current = mapgl;

      mapRef.current = new mapgl.Map(
        containerRef.current,
        {
          center: [37.640655, 55.755335],
          zoom: 11,
          key: MAP_KEY,
          style: MAP_STYLE,
          preserveDrawingBuffer: true,
          enableTrackResize: true
          // WebGL не очищает framebuffer, Canvas карты читаем, html2canvas видит карту
        }
      );
    });

    return () => {
      destroyed = true;

      polylinesRef.current.forEach((p) => p.destroy());
      polylinesRef.current = [];

      mapRef.current?.destroy();
      mapRef.current = null;
      mapglRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !mapglRef.current) return;

    polylinesRef.current.forEach((p) => p.destroy());
    polylinesRef.current = [];

    lines.forEach((line) => {
      const polyline = new mapglRef.current!.Polyline(
        mapRef.current!,
        {
          coordinates: line,
          width: 3,
          color: "#FF3B30",
        }
      );

      polylinesRef.current.push(polyline);
    });
  }, [lines]);

  return <div className={classNames(styles.mapWrapper, "map-canvas-container")} ref={containerRef} />;
};

export default Map2GIS;
