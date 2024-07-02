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
  optionWidth,style,
  setSearchQuery
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [navigateIndex, setNavigateIndex] = useState(0);
  const inputRef = useRef(null);
  const selectRef = useRef(null);
  defaultText = common.defaultIfEmpty(defaultText, "Select option...");
  defaultValue = common.defaultIfEmpty(defaultValue, "");
  optionWidth = common.defaultIfEmpty(optionWidth, "100%");
  disabled = common.defaultIfEmpty(disabled, false);
  searchPattern = common.defaultIfEmpty(searchPattern, "%%");
  onChange = common.defaultIfEmpty(onChange, ()=>{});
  value = common.defaultIfEmpty(value, defaultText);
  elementKey = common.defaultIfEmpty(elementKey, "id");
  text = common.defaultIfEmpty(text, "value");  
  setSearchQuery = common.defaultIfEmpty(setSearchQuery, ()=>{});  
  itemOnClick = common.defaultIfEmpty(itemOnClick, () => { });
  useEffect(() => {
    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option) => {
    setQuery(() => "");
    setSearchQuery(() => "");
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

  const filter = (dataList) => {
    if (searchPattern === "_%") { // Start With
      return dataList?.filter(x => query?.trim() === "" || x[text].toLowerCase().startsWith(query.toLowerCase()));
    }
    else if (searchPattern === "%_") { // Start With
      return dataList?.filter(x => query?.trim() === "" || x[text].toLowerCase().endsWith(query.toLowerCase()));
    }
    else
      return dataList?.filter(x => query?.trim() === "" || x[text].toLowerCase().indexOf(query.toLowerCase()) > -1);
  };
  const navigateList = (e) => {
    var keyCode = e.keyCode; //38-KeyUp,40-KeyDown,13-enter,8-backspace
    if (keyCode === 38) {
      var filterData=filter(data);
      if (navigateIndex > 0 && navigateIndex>0)
        setNavigateIndex(pre => pre - 1)
      else
        setNavigateIndex(0);
        setTimeout(() => {
          setChange();
        }, [100]);
    }
    if (keyCode === 40) {
       filterData=filter(data);
      if (!isOpen) {
        setIsOpen(true);
      }
      if (navigateIndex < filterData?.length - 1)
        setNavigateIndex(pre => pre + 1)
      else
        setNavigateIndex(filterData?.length - 1);
        setTimeout(() => {
          setChange();
        }, [100]);
    }
   if (keyCode === 13) {
     filterData=filter(data);
      setQuery(() => "");
      setSearchQuery(() => "");
      onChange({
        target: {
          name: name,
          value: filterData[navigateIndex][elementKey],
          type: 'select-one'
        }
      });
      setIsOpen(false);
      itemOnClick(filterData[navigateIndex]);
    }
   if (keyCode === 8 && e.repeat) {
      setQuery(() => "");
      setSearchQuery(() => "");
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
  function setChange() {
    const selected = selectRef?.current?.querySelector(".navigated");
    if (selected) {
      selected?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }
  return (
    <div className="dropdown">
      <div className="control">
        <div className="selected-value" 
            style={style}>
          <input
            //onKeyUp={e => { navigateList(e) }}
            onKeyDown={e => navigateList(e)}
            ref={inputRef}
            type="text"
            value={getDisplayValue()}
            name="searchTerm"
            disabled={disabled ? "disabled" : ""}
            placeholder={defaultText}
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchQuery(e.target.value);
              // onChange({
              //   target: {
              //     name: name,
              //     value: defaultValue,
              //     type: 'select-one'
              //   }
              // });
            }}
            data-name="searchabledropdown"
            onClick={toggle}
            className=" form-control form-control-sm"
          />
        </div>
        <div className={`arrow ${isOpen ? "open" : ""}`}></div>
      </div>

      <div ref={selectRef} className={`options ${isOpen ? "open" : ""}`} style={{width:optionWidth}}>
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
