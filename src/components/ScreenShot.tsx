import classNames from "classnames";
import styles from "./ScreenShot.module.css";
import html2canvas from "html2canvas";

// Получаем относительные координаты preview внутри карты
function getRelativeRect(preview: HTMLElement, mapContainer: HTMLElement) {
  const previewRect = preview.getBoundingClientRect();
  const mapRect = mapContainer.getBoundingClientRect();

  return {
    x: previewRect.left - mapRect.left,
    y: previewRect.top - mapRect.top,
    width: previewRect.width,
    height: previewRect.height,
  };
}

// Вырезаем нужную область из canvas карты
function cropMapCanvas(
  mapCanvas: HTMLCanvasElement,
  rect: { x: number; y: number; width: number; height: number },
): HTMLCanvasElement {
  const ratio = window.devicePixelRatio || 1;

  const canvas = document.createElement("canvas");
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(ratio, ratio);

  ctx.drawImage(
    mapCanvas,
    rect.x * ratio,
    rect.y * ratio,
    rect.width * ratio,
    rect.height * ratio,
    0,
    0,
    rect.width,
    rect.height,
  );

  return canvas;
}

// Склейка карты и overlay
function mergeCanvases(
  mapCanvas: HTMLCanvasElement,
  overlayCanvas: HTMLCanvasElement,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = overlayCanvas.width;
  canvas.height = overlayCanvas.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(mapCanvas, 0, 0);
  ctx.drawImage(overlayCanvas, 0, 0);

  return canvas;
}

const ScreenShot = () => {
  const handleCapture = async () => {
    const preview = document.getElementById("preview");
    const mapContainer = document.querySelector(
      ".map-canvas-container",
    ) as HTMLElement | null;

    const mapCanvas = mapContainer?.querySelector("canvas");

    if (!preview || !mapContainer || !mapCanvas) {
      console.warn("Не удалось найти preview или canvas карты");
      return;
    }

    try {
      // 1. Геометрия области
      const rect = getRelativeRect(preview, mapContainer);

      // 2. Вырезаем карту
      const croppedMapCanvas = cropMapCanvas(mapCanvas, rect);

      // 3. Снимаем overlay
      const overlayCanvas = await html2canvas(preview, {
        backgroundColor: null,
      });

      // 4. Склейка
      const finalCanvas = mergeCanvases(croppedMapCanvas, overlayCanvas);

      // 5. Сохранение
      const link = document.createElement("a");
      link.href = finalCanvas.toDataURL("image/png");
      link.download = "map-preview.png";
      link.click();
    } catch (e) {
      console.error("Ошибка создания скриншота", e);
    }
  };

  return (
    <div className={classNames(styles.screen__shot)}>
      <div id={"preview"} className={classNames(styles.screen__shot_area)}>
        <div className={classNames(styles.screen__shot_codd)}></div>
        <div className={classNames(styles.screen__shot_events)}></div>
      </div>
      <div className={classNames(styles.screen__shot_panel)}>
        <div className={classNames(styles.screen__shot_view)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className={classNames(styles.screen__shot_download)}>
          <button onClick={handleCapture}>Скриншот</button>
        </div>
      </div>
    </div>
  );
};

export default ScreenShot;
