import classNames from "classnames";
import styles from "./ScreenShot.module.css";
import html2canvas from "html2canvas";

/**
 * ===== НАСТРОЙКА КАЧЕСТВА =====
 * 1 — обычное Retina
 * 2 — высокое качество
 * 3 — очень высокое (осторожно с памятью)
 */
const EXPORT_SCALE = 1;

/**
 * Получаем координаты preview относительно контейнера карты
 */
function getRelativeRect(preview: HTMLElement, container: HTMLElement) {
  const previewRect = preview.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: previewRect.left - containerRect.left,
    y: previewRect.top - containerRect.top,
    width: previewRect.width,
    height: previewRect.height,
  };
}

/**
 * Вырезаем область карты с учётом итогового ratio
 */
function cropMapCanvas(
  mapCanvas: HTMLCanvasElement,
  rect: { x: number; y: number; width: number; height: number },
  ratio: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    mapCanvas,
    rect.x * ratio,
    rect.y * ratio,
    rect.width * ratio,
    rect.height * ratio,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas;
}

/**
 * Склейка карты и overlay
 */
function mergeCanvases(
  mapCanvas: HTMLCanvasElement,
  overlayCanvas: HTMLCanvasElement,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  canvas.width = overlayCanvas.width;
  canvas.height = overlayCanvas.height;

  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

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
      // ===== ЕДИНЫЙ КОЭФФИЦИЕНТ КАЧЕСТВА =====
      const ratio = (window.devicePixelRatio || 1) / EXPORT_SCALE;

      // 1. Геометрия области
      const rect = getRelativeRect(preview, mapContainer);

      // 2. Карта (HiDPI)
      const croppedMapCanvas = cropMapCanvas(
        mapCanvas,
        rect,
        ratio,
      );

      // 3. Overlay (тот же ratio)
      const overlayCanvas = await html2canvas(preview, {
        backgroundColor: null,
        scale: ratio,
        useCORS: true,
      });

      // 4. Финальный canvas
      const finalCanvas = mergeCanvases(
        croppedMapCanvas,
        overlayCanvas,
      );

      // 5. Сохранение
      const link = document.createElement("a");
      link.href = finalCanvas.toDataURL("image/png");
      link.download = "map-preview.png";
      link.click();
    } catch (error) {
      console.error("Ошибка создания скриншота", error);
    }
  };

  return (
    <div className={classNames(styles.screen__shot)}>
      <div id="preview" className={styles.screen__shot_area}>
        <div className={styles.screen__shot_codd}>
          <svg xmlns="http://www.w3.org/2000/svg" width="75" height="40" viewBox="0 0 75 40" fill="none">
            <g clip-path="url(#clip0_787_43793)">
              <path d="M24.8824 24.815C26.9854 22.7038 28.2868 19.7949 28.2868 16.5871C28.2868 10.1561 23.0554 4.92428 16.6244 4.92428C10.1951 4.92428 4.96165 10.1561 4.96165 16.5871C4.96165 19.7949 6.28687 22.7324 8.36775 24.815C8.61282 25.06 8.95212 25.2197 9.32854 25.2197C10.0673 25.2197 10.6668 24.6201 10.6668 23.8812C10.6668 23.4983 10.504 23.1556 10.2487 22.912C8.63633 21.2863 7.63881 19.0508 7.63881 16.5871C7.63881 11.6322 11.6696 7.59973 16.6244 7.59973C21.5806 7.59973 25.6131 11.6322 25.6131 16.5871C25.6131 19.0643 24.6037 21.3097 22.978 22.9372L11.3285 34.5849L13.2214 36.476L24.8824 24.815ZM7.26512 27.2775C7.26512 26.9012 7.10411 26.5586 6.85546 26.3083C4.37964 23.8328 2.83487 20.3813 2.83487 16.5873C2.83487 8.98416 9.02219 2.79664 16.6237 2.79664C24.2283 2.79664 30.4142 8.98416 30.4142 16.5873C30.4142 20.3897 28.8674 23.8377 26.3698 26.3353L14.7242 37.9795L16.6219 39.8773L28.2746 28.2231C31.2507 25.2435 33.0914 21.1305 33.0914 16.5873C33.0914 7.49255 25.7199 0.121094 16.6237 0.121094C7.53058 0.121094 0.157715 7.49255 0.157715 16.5873C0.157715 21.127 2.00327 25.2502 4.96581 28.2147C5.21965 28.4666 5.55197 28.6143 5.9266 28.6143C6.66574 28.6143 7.26512 28.0149 7.26512 27.2775ZM23.4846 16.5863C23.4846 12.8042 20.4058 9.72727 16.6254 9.72727C12.8429 9.72727 9.76625 12.8042 9.76625 16.5863C9.76625 20.3687 12.8429 23.4474 16.6254 23.4474C20.4058 23.4474 23.4846 20.3688 23.4846 16.5863ZM12.4416 16.5863C12.4416 14.2803 14.3177 12.4027 16.6254 12.4027C18.9314 12.4027 20.8075 14.2803 20.8075 16.5863C20.8075 18.8941 18.9314 20.7719 16.6254 20.7719C14.3177 20.7719 12.4416 18.8941 12.4416 16.5863Z" fill="#EEF7EB"/>
              <path d="M74.3884 16.5867C74.3884 7.49283 67.0167 0.121094 57.9227 0.121094C48.8288 0.121094 41.457 7.49283 41.457 16.5867C41.457 21.1262 43.3021 25.2501 46.2655 28.2137C46.5178 28.466 46.8508 28.6139 47.2259 28.6139C47.9642 28.6139 48.563 28.0135 48.563 27.2769C48.563 26.9018 48.4031 26.5587 48.1543 26.3081C45.6785 23.8341 44.133 20.3811 44.133 16.5867C44.133 8.98463 50.3189 2.79693 57.9227 2.79693C65.5266 2.79693 71.7125 8.98463 71.7125 16.5867C71.7125 20.3896 70.1652 23.8375 67.6676 26.3334L56.0222 37.9787L57.9193 39.8759L69.5732 28.2237C72.5484 25.2435 74.3884 21.1312 74.3884 16.5867Z" fill="#EEF7EB"/>
              <path d="M51.278 20.1193H49.1113L56.8389 12.5312H59.0054L51.278 20.1193Z" fill="#EEF7EB"/>
              <path d="M55.4103 20.1193H53.2437L60.9712 12.5312H63.1378L55.4103 20.1193Z" fill="#EEF7EB"/>
              <path d="M59.7608 20.1193H57.5942L65.3217 12.5312H67.4884L59.7608 20.1193Z" fill="#EEF7EB"/>
            </g>
            <defs>
              <clipPath id="clip0_787_43793">
                <rect width="74.4643" height="40" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </div>
        {/* <div className={styles.screen__shot_events} /> */}
      </div>

      <div className={styles.screen__shot_panel}>
        <div className={styles.screen__shot_view}>
          <div />
          <div />
          <div />
        </div>

        <div className={styles.screen__shot_download}>
          <button onClick={handleCapture}>Фото</button>
        </div>
      </div>
    </div>
  );
};

export default ScreenShot;
