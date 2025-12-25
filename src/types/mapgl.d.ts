// declare global {
//   interface Window {
//     mapgl: MapGL;
//   }
  
//   interface ImportMetaEnv {
//     readonly VITE_2GIS_URL: string;
//     readonly VITE_2GIS_KEY: string;
//     readonly VITE_2GIS_STYLE: string;
//   }

//   interface ImportMeta {
//     readonly env: ImportMetaEnv;
//   }

//   interface MapGL {
//     Map: new (options: MapGLOptions) => MapGLInstance;
//   }

//   interface MapGLOptions {
//     container: HTMLElement | string;
//     key: string;
//     style: string;
//     center: [number, number];
//     zoom: number;
//   }

//   interface MapGLInstance {
//     destroy(): void;
//   }
// }

// export {};

declare global {
  interface Window {
    mapgl: MapGL;
  }

  interface ImportMetaEnv {
    readonly VITE_2GIS_URL: string;
    readonly VITE_2GIS_KEY: string;
    readonly VITE_2GIS_STYLE: string;
    readonly VITE_GOOGLE_SHEET_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface MapGL {
    Map: new (options: MapGLOptions) => MapGLInstance;
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
    layers?: MapGLLayer[];
    addLayer(layer: MapGLLayerOptions): void;
    removeLayer(id: string): void;
    on(event: "styleload", callback: () => void): void;
  }

  interface MapGLLayer {
    id: string;
    type: "line" | string;
  }

  interface MapGLLayerOptions {
    id: string;
    type: "line";
    coordinates: [number, number][];
    style?: {
      strokeColor?: string;
      strokeWidth?: number;
    };
  }
}

export {};