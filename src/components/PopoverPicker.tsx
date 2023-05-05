import { AnimatePresence, motion } from "framer-motion";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import { HexColorPicker } from "react-colorful";
import OutsideClickHandler from "react-outside-click-handler";

const PopoverPicker = ({ color: defaultColor, onChange }: Props) => {
  const [color, setColor] = useState<string>("");
  const popover = useRef<HTMLDivElement>(null);
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => {
    toggle(false);
    onChange(color);
  }, [color]);

  useEffect(() => {
    if (!color && defaultColor) {
      setColor(defaultColor);
    }
  }, [color]);

  return (
    <div className="relative z-10">
      <div
        className="h-7 w-7 cursor-pointer rounded-lg border-2 border-gray-300"
        style={{ backgroundColor: color }}
        onClick={() => toggle(true)}
      />
      <AnimatePresence>
        {isOpen && (
          <OutsideClickHandler onOutsideClick={() => close()}>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              transition={{ duration: 0.1, ease: "easeIn" }}
              
            >
              <div
                className="absolute z-10 top-[calc(100%+2px)] left-0 rounded-[0.5625rem] shadow-2xl"
                ref={popover}
              >
                <HexColorPicker
                  color={color}
                  onChange={(color) => setColor(color)}
                />
              </div>
            </motion.div>
          </OutsideClickHandler>
        )}
      </AnimatePresence>
    </div>
  );
};

interface Props {
  color: string;
  onChange: (arg0: string) => void | Dispatch<SetStateAction<string>>;
}

export default PopoverPicker;
