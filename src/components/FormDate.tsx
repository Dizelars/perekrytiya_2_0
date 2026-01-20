import classNames from "classnames";
import styles from "./FormDate.module.css";
import { useMapData } from "../map/useMapData";

type Props = {
    today: string;
    onDateInput: (date: string) => void;
};

const FormDate = ({ today, onDateInput }: Props) => {
    const { events } = useMapData();

    return (
        <form
            className={classNames(styles.formData)}
            onSubmit={(event) => event.preventDefault()}
        >
            <div className={classNames(styles.formData_item)}>
                <label htmlFor="event">Дата мероприятия: </label>
                <input
                    type="date"
                    id="event"
                    name="event-date"
                    value={today}
                    onInput={(event) => onDateInput(event.currentTarget.value)}
                />
            </div>
            <div className={classNames(styles.formData_item)}>
                <p>Список мероприятий: </p>
                {events.length > 0 && (
                    <ul>
                        {events.map((event) => (
                            <li key={event.id}>{event.work}</li>
                        ))}
                    </ul>
                )}
            </div>
        </form>
    );
};

export default FormDate;
