import * as React from "react";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import debounce from "lodash.debounce";

const range = [5000, 200000];

function SalaryRangeSlider({ value, onChange }) {
  const [sliderRange, setSliderRange] = React.useState(range);

  const histogramData = [
    4, 5, 6, 8, 10, 12, 15, 18, 20, 25, 30, 28, 25, 20, 18, 15, 12, 10, 8, 6, 5,
    4, 3, 2,
  ];

  const min = range[0];
  const max = range[1];

  const handleChange = React.useCallback(debounce(onChange, 300), []);

  const handleRangeChange = (newRange) => {
    setSliderRange(newRange);
    handleChange(newRange);
  };

  React.useEffect(() => {
    if (value) setSliderRange(value);
  }, []);

  return (
    <div className="w-full p-4 space-y-6">
      <div className="relative h-24 mb-8">
        <div className="absolute inset-0 flex items-end justify-between gap-[2px]">
          {histogramData.map((value, index) => {
            const isInRange =
              (index / histogramData.length) * max >= sliderRange[0] &&
              (index / histogramData.length) * max <= sliderRange[1];

            return (
              <div
                key={index}
                className={`w-full ${isInRange ? "bg-primary" : "bg-muted"}`}
                style={{
                  height: `${(value / Math.max(...histogramData)) * 100}%`,
                }}
              />
            );
          })}
        </div>
        <Slider
          defaultValue={sliderRange}
          min={min}
          max={max}
          step={1}
          value={sliderRange}
          onValueChange={handleRangeChange}
          className="absolute bottom-0 w-full"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="min" className="text-muted-foreground">
            Minimum
          </Label>
          <div className="relative">
            <span className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              Rs.
            </span>
            <Input
              min={range[0]}
              max={range[1]}
              id="min"
              type="number"
              onBlur={() => {
                if (isNaN(sliderRange[0]) || sliderRange[0] < range[0]) {
                  handleRangeChange([range[0], sliderRange[1]]);
                }
              }}
              value={sliderRange[0]}
              onChange={(e) =>
                handleRangeChange([parseInt(e.target.value), sliderRange[1]])
              }
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center pt-8">—</div>
        <div className="flex-1">
          <Label htmlFor="max" className="text-muted-foreground">
            Maximum
          </Label>
          <div className="relative">
            <span className="absolute z-10 left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              Rs.
            </span>
            <Input
              min={range[0]}
              max={range[1]}
              id="max"
              type="number"
              value={sliderRange[1]}
              onBlur={() => {
                if (isNaN(sliderRange[1]) || sliderRange[1] < range[0]) {
                  handleRangeChange([sliderRange[0], range[1]]);
                }
              }}
              onChange={(e) =>
                handleRangeChange([sliderRange[0], parseInt(e.target.value)])
              }
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryRangeSlider;
