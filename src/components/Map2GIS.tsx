import { load } from '@2gis/mapgl';
import classNames from "classnames";
import styles from "./Map2GIS.module.css";
import { useEffect, useRef  } from "react";

const MAP_URL = import.meta.env.VITE_2GIS_URL;
const MAP_KEY = import.meta.env.VITE_2GIS_KEY;
const MAP_STYLE = import.meta.env.VITE_2GIS_STYLE;

const Map2GIS = () => {
  const mapRef = useRef<MapGLInstance | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let destroyed = false;

    if (mapRef.current) return;

    load(MAP_URL).then((mapgl) => {
      if (destroyed || !containerRef.current) return;

      mapRef.current = new mapgl.Map(containerRef.current, {
        center: [37.640655, 55.755335],
        zoom: 11,
        key: MAP_KEY,
        style: MAP_STYLE,
      });
    });

    return () => {
      destroyed = true;
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, []);

  return <div className={classNames(styles.mapWrapper)} ref={containerRef} />;
};

export default Map2GIS;
