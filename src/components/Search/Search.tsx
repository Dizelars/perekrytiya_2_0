import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import styles from "./Search.module.css";

const API_KEY = import.meta.env.VITE_2GIS_KEY as string;
const SEARCH_URL = import.meta.env.VITE_SEARCH_URL as string;

export interface SuggestItem {
  address_name: string;
  id: string;
  name: string;
}

interface SuggestResponse {
  result?: {
    items?: SuggestItem[];
  };
}

interface SearchProps {
  onSelect?: (item: SuggestItem) => void;
}

const Search: React.FC<SearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showList, setShowList] = useState<boolean>(false);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowList(false);
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const fetchSuggest = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${SEARCH_URL}/3.0/suggests?q=${encodeURIComponent(query)}&key=${API_KEY}`,
          { signal: controller.signal }
        );

        const data: SuggestResponse = await response.json();

        console.log(data);

        setSuggestions(data.result?.items ?? []);
        setShowList(true);
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") {
          console.error("Ошибка API:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuggest();

    return () => controller.abort();
  }, [query]);

  const handleSelect = (item: SuggestItem) => {
    setQuery(item.name);
    setShowList(false);
    onSelect?.(item);
  };

  return (
    <div className={classNames(styles.Search)}>
      <form
        className={classNames(styles.Search_form)}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={classNames(styles.Search_formData_item)}>
          <label htmlFor="search">Поиск:</label>
          <input
            type="search"
            id="search"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            onFocus={() => query && setShowList(true)}
            autoComplete="off"
            placeholder="Введите адрес или организацию"
          />
        </div>
      </form>

      {showList && (
        <ul className={styles.Search_list}>
          {loading && <li className={styles.Loading}>Загрузка...</li>}

          {!loading && suggestions.length === 0 && (
            <li className={styles.Empty}>Ничего не найдено</li>
          )}

          {suggestions.map((item) => (
            <li
              key={item.id}
              className={styles.Search_item}
              onClick={() => handleSelect(item)}
            >
              <span className={styles.Search_item_name}>{item.name}</span>
              {item.address_name && (
                <span className={styles.AddressText}>
                  {" — "}{item.address_name}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
