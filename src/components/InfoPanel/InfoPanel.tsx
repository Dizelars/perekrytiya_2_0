import { useState } from "react";
import classNames from "classnames";
import styles from "./InfoPanel.module.css";
import FormDate from "../FormDate/FormDate";
import DraggableElement from "../DraggableElement";
import TransformWrapper from "../TransformWrapper";
import ScreenShot from "../ScreenShot/ScreenShot";
import EditModeToggle from "../EditModeToggle";
import Search from "../Search/Search";

type Props = {
  today: string;
  onDateChange: (date: string) => void;
  onPlaceSelect: (place: MapSearchSelection) => void;
};

type ActiveOverlay = "scheme" | "screenshot" | null;

const InfoPanel = ({ today, onDateChange, onPlaceSelect }: Props) => {
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);

  const toggleOverlay = (type: Exclude<ActiveOverlay, null>) => {
    setActiveOverlay((prev) => (prev === type ? null : type));
  };

  return (
    <div className={classNames(styles.infoPanel)}>
      <h1>Перекрытия 2.0</h1>

      <div className={styles.infoPanel__buttos}>
        <button onClick={() => toggleOverlay("scheme")}>Схема</button>
        <button onClick={() => toggleOverlay("screenshot")}>Скриншот</button>
        <EditModeToggle />
      </div>

      {activeOverlay === "scheme" && (
        <DraggableElement initialPosition={{ x: 550, y: 100 }}>
          <TransformWrapper>
            <img src="/img_1.webp" draggable={false} style={{ width: 500 }} />
          </TransformWrapper>
        </DraggableElement>
      )}

      {activeOverlay === "screenshot" && (
        <DraggableElement initialPosition={{ x: 500, y: 500 }}>
          <ScreenShot />
        </DraggableElement>
      )}

      <Search onSelect={(item) => onPlaceSelect({ address_name: item.address_name, id: item.id, name: item.name })}/>
      <FormDate today={today} onDateInput={onDateChange} />
    </div>
  );
};

export default InfoPanel;
