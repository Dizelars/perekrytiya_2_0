import classNames from "classnames";
import styles from "./InfoPanel.module.css";
import DraggableElement from "./DraggableElement";
import FormDate from "./FormDate";

type Props = {
    today: string;
    onDateChange: (date: string) => void;
};

const InfoPanel = ({ today, onDateChange }: Props) =>  {
    return (
        <div className={classNames(styles.infoPanel)}>
            <h1>Перекрытия 2.0</h1>

            <DraggableElement initialPosition={{ x: 50, y: 100 }}>
                <img
                    src="/img_1.webp"
                    draggable={false}
                    style={{ width: 700, opacity: 0.7 }}
                />
            </DraggableElement>


            <FormDate 
                today={today}
                onDateInput={onDateChange} 
            />
        </div>
    );
};

export default InfoPanel;
