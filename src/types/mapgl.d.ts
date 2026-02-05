declare global {
  interface Window {
    mapgl: MapGL;
  }
  
  interface ImportMetaEnv {
    readonly VITE_2GIS_URL: string;
    readonly VITE_2GIS_KEY: string;
    readonly VITE_2GIS_STYLE: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface MapGLOptions {
    container: HTMLElement | string;
    key: string;
    style: string;
    center: [number, number];
    zoom: number;
  }

  interface MapGLInstance {
    destroy(): void;
  }

  interface MapSearchSelection {
    address_name: string,
    id: string;
    name: string;
  }
}

export {};