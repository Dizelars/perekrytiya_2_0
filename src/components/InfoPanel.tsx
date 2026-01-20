import classNames from "classnames";
import styles from "./InfoPanel.module.css";
// import DraggableImage from "./DraggableImage";
import FormDate from "./FormDate";

type Props = {
    today: string;
    onDateChange: (date: string) => void;
};

const InfoPanel = ({ today, onDateChange }: Props) =>  {
    return (
        <div className={classNames(styles.infoPanel)}>
            <h1>Перекрытия 2.0</h1>

            {/* <DraggableImage
                src="/img_1.webp"
                initialPosition={{ x: 50, y: 100 }}
            /> */}

            <FormDate 
                today={today}
                onDateInput={onDateChange} 
            />
        </div>
    );
};

export default InfoPanel;
