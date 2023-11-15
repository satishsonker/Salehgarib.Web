import { useEffect, useRef, useState } from "react";
import '../SearchableDropdown/dropdown.css'
import { common } from "../../../utils/common";

const SearchableDropdown = ({
  data,
  elementKey,
  text,
  id,
  value,
  name,
  onChange,
  defaultText,
  defaultValue,
  disabled,
  currentIndex = -1,
  itemOnClick,
  searchPattern,
  optionWidth
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [navigateIndex, setNavigateIndex] = useState(0);
  const inputRef = useRef(null);
  defaultText = common.defaultIfEmpty(defaultText, "Select option...");
  defaultValue = common.defaultIfEmpty(defaultValue, "");
  optionWidth = common.defaultIfEmpty(optionWidth, "100%");
  disabled = common.defaultIfEmpty(disabled, false);
  searchPattern = common.defaultIfEmpty(searchPattern, "%%");
  onChange = common.defaultIfEmpty(onChange, ()=>{});
  value = common.defaultIfEmpty(value, defaultText);
  elementKey = common.defaultIfEmpty(elementKey, "id");
  text = common.defaultIfEmpty(text, "value");   
  itemOnClick = common.defaultIfEmpty(itemOnClick, () => { });
  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery(() => "");
    onChange({
      target: {
        name: name,
        value: option[elementKey],
        type: 'select-one'
      }
    });
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e) {
    setIsOpen(e && e.target === inputRef.current);
    //setNavigateIndex(!isOpen?-1:navigateIndex);
  }

  const getDisplayValue = () => {
    if (query) return query;
    var val = data?.find(x => x[elementKey] === value);
    if (value) return val === undefined ? "" : val[text];

    return "";
  };

  const filter = (data) => {
    if (searchPattern === "_%") { // Start With
      return data?.filter(x => query?.trim() === "" || x[text].toLowerCase().startsWith(query.toLowerCase()));
    }
    else if (searchPattern === "%_") { // Start With
      return data?.filter(x => query?.trim() === "" || x[text].toLowerCase().endsWith(query.toLowerCase()));
    }
    else
      return data?.filter(x => query?.trim() === "" || x[text].toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  const navigateList = (e) => {
    var keyCode = e.keyCode; //38-KeyUp,40-KeyDown,13-enter,8-backspace
    if (keyCode === 38) {
      if (navigateIndex > 0)
        setNavigateIndex(pre => pre - 1)
      else
        setNavigateIndex(0);
    }
    if (keyCode === 40) {
      if (!isOpen) {
        setIsOpen(true);
      }
      if (navigateIndex < data?.length - 1)
        setNavigateIndex(pre => pre + 1)
      else
        setNavigateIndex(data?.length - 1);
    }
    if (keyCode === 13) {
      setQuery(() => "");
      onChange({
        target: {
          name: name,
          value: data[navigateIndex][elementKey],
          type: 'select-one'
        }
      });
      setIsOpen(false);
      itemOnClick(data[navigateIndex]);
    }
    if (keyCode === 8 && e.repeat) {
      setQuery(() => "");
      onChange({
        target: {
          name: name,
          value: "",
          type: 'select-one'
        }
      });
      setIsOpen((isOpen) => !isOpen);
    }
  }
  return (
    <div className="dropdown">
      <div className="control">
        <div className="selected-value">
          <input
            // onKeyUp={e => { navigateList(e) }}
            onKeyDown={e => { navigateList(e) }}
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            disabled={disabled ? "disabled" : ""}
            placeholder={defaultText}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange({
                target: {
                  name: name,
                  value: defaultValue,
                  type: 'select-one'
                }
              });
            }}
            onClick={toggle}
            className=" form-control form-control-sm"
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div className={`options ${isOpen ? "open" : ""}`} style={{width:optionWidth}}>
        {filter(data)?.map((option, index) => {
          return (
            <div
              onClick={e => {selectOption(option); itemOnClick(option, currentIndex)}}
              className={`option ${index === navigateIndex ? "navigated " : ""} ${option[elementKey] === value ? "selected" : ""}`}
              key={`${id}-${index}`}
            >
              {option[text]}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchableDropdown;
