"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipProps } from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    formatter?: (
      value: number,
      name: string,
      item: TooltipProps["payload"][number],
      index: number,
      fullPayload: unknown
    ) => React.ReactNode
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart(): ChartContextProps {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}): JSX.Element {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({
  id,
  config,
}: {
  id: string
  config: ChartConfig
}): JSX.Element | null => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

type ChartTooltipContentProps = TooltipProps & {
  className?: string
  indicator?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  labelFormatter?: (label: unknown) => React.ReactNode
}

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  ...props
}: ChartTooltipContentProps): JSX.Element | null {
  const { config } = useChart()

  if (!active || !payload || !payload.length) {
    return null
  }

  const formattedLabel =
    labelFormatter && label !== undefined
      ? labelFormatter(label)
      : label

  return (
    <div
      className={cn(
        "rounded-md border bg-popover px-4 py-2 text-popover-foreground shadow-lg min-w-[120px] max-w-xs",
        className
      )}
      {...props}
    >
      {!hideLabel && (
        <div className="mb-2 text-xs font-medium text-muted-foreground truncate">
          {formattedLabel}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((item, index) => {
          if (!item) return null
          const itemConfig = config[item.name as string]
          const formatter = itemConfig?.formatter

          return (
            <div
              key={item.name}
              className={cn(
                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                indicator === "dot" && "items-center"
              )}
            >
              {!hideIndicator && indicator === "dot" && (
                <span
                  className="inline-block rounded-full"
                  style={{
                    backgroundColor:
                      itemConfig?.color || `var(--color-${item.name})`,
                    width: 10,
                    height: 10,
                    marginRight: 4,
                  }}
                />
              )}
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon />
                  ) : (
                    <span className="font-medium">{item.value}</span>
                  )}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegendContent = () => {
  // Optional: You can implement a legend layout here
  return null
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegendContent,
  ChartStyle,
  useChart,
}
