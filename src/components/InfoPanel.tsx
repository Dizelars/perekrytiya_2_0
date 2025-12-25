import classNames from "classnames";
import styles from "./InfoPanel.module.css";

const InfoPanel = () => {
    return (
        <div className={classNames(styles.infoPanel)}>
            <h1>Перекрытия 2.0</h1>
        </div>
    );
};

export default InfoPanel;