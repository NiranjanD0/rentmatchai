"use client";

import type { ComponentPropsWithRef, HTMLAttributes, ReactNode, Ref, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { createContext, isValidElement, useContext } from "react";
import { ArrowDown, ChevronSelectorVertical, DotsVertical, Edit01, Eye, HelpCircle, PauseCircle, PlayCircle, Trash01 } from "@untitledui/icons";
import type {
    CellProps as AriaCellProps,
    ColumnProps as AriaColumnProps,
    RowProps as AriaRowProps,
    TableHeaderProps as AriaTableHeaderProps,
    TableProps as AriaTableProps,
} from "react-aria-components";
import {
    Cell as AriaCell,
    Collection as AriaCollection,
    Column as AriaColumn,
    Group as AriaGroup,
    Row as AriaRow,
    Table as AriaTable,
    TableBody as AriaTableBody,
    TableHeader as AriaTableHeader,
    useTableOptions,
} from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";

export interface TableRowActionsDropdownProps {
    onView?: () => void;
    onEdit?: () => void;
    onToggleStatus?: () => void;
    onDelete?: () => void;
    isPaused?: boolean;
}

export const TableRowActionsDropdown = ({
    onView,
    onEdit,
    onToggleStatus,
    onDelete,
    isPaused,
}: TableRowActionsDropdownProps) => (
    <DropdownMenu>
        <DropdownMenuTrigger
            render={
                <button
                    type="button"
                    aria-label="Actions"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors cursor-pointer active:scale-90"
                />
            }
        >
            <DotsVertical className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-1 text-zinc-800 dark:text-zinc-200 z-50" align="end" side="bottom" sideOffset={4}>
            <DropdownMenuGroup>
                {onView && (
                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={onView}>
                        <Eye className="size-4 text-zinc-500 dark:text-zinc-400" />
                        <span>View details</span>
                    </DropdownMenuItem>
                )}
                {onEdit && (
                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={onEdit}>
                        <Edit01 className="size-4 text-zinc-500 dark:text-zinc-400" />
                        <span>Edit property</span>
                    </DropdownMenuItem>
                )}
                {onToggleStatus && (
                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={onToggleStatus}>
                        {isPaused ? (
                            <PlayCircle className="size-4 text-emerald-500" />
                        ) : (
                            <PauseCircle className="size-4 text-amber-500" />
                        )}
                        <span>{isPaused ? "Activate listing" : "Pause listing"}</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuGroup>
            {onDelete && (
                <>
                    <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            variant="destructive"
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus:bg-red-50 dark:focus:bg-red-950/40"
                            onClick={onDelete}
                        >
                            <Trash01 className="size-4 text-red-500" />
                            <span>Delete property</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
);

const TableContext = createContext<{ size: "sm" | "md" }>({ size: "md" });

const TableCardRoot = ({
    children,
    className,
    size = "md",
    ...props
}: HTMLAttributes<HTMLDivElement> & {
    /** Controls the density of the card and every descendant header, row and cell. */
    size?: "sm" | "md";
}) => {
    return (
        <TableContext.Provider value={{ size }}>
            <div
                {...props}
                className={cx(
                    "overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card shadow-2xs",
                    className
                )}
            >
                {children}
            </div>
        </TableContext.Provider>
    );
};

interface TableCardHeaderProps {
    /** The title of the table card header. */
    title: string;
    /** The badge displayed next to the title. */
    badge?: ReactNode;
    /** The description of the table card header. */
    description?: string;
    /** The content displayed after the title and badge. */
    contentTrailing?: ReactNode;
    /** The class name of the table card header. */
    className?: string;
}

const TableCardHeader = ({ title, badge, description, contentTrailing, className }: TableCardHeaderProps) => {
    const { size } = useContext(TableContext);

    return (
        <div
            className={cx(
                "relative flex flex-col items-start gap-4 border-b border-border bg-card px-4 md:flex-row md:items-center",
                size === "sm" ? "py-3.5 md:px-5" : "py-5 md:px-6",
                className,
            )}
        >
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">{title}</h2>
                    {badge ? (
                        isValidElement(badge) ? (
                            badge
                        ) : (
                            <Badge color="gray" size="sm" type="modern">
                                {badge}
                            </Badge>
                        )
                    ) : null}
                </div>
                {description && <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
            </div>
            {contentTrailing && <div className="shrink-0">{contentTrailing}</div>}
        </div>
    );
};

interface TableRootProps extends AriaTableProps, Omit<ComponentPropsWithRef<"table">, "className" | "slot" | "style"> {
    /** Controls the density of the header, rows and cells. The size of a wrapping `TableCard.Root` takes precedence. */
    size?: "sm" | "md";
}

const TableRoot = ({ className, size = "md", ...props }: TableRootProps) => {
    const context = useContext(TableContext);

    return (
        <TableContext.Provider value={{ size: context?.size ?? size }}>
            <div className="overflow-x-auto">
                <AriaTable
                    className={(state) =>
                        cx("w-full border-collapse text-left text-xs", typeof className === "function" ? className(state) : className)
                    }
                    {...props}
                />
            </div>
        </TableContext.Provider>
    );
};
TableRoot.displayName = "Table";

interface TableHeaderProps<T extends object>
    extends AriaTableHeaderProps<T>, Omit<ComponentPropsWithRef<"thead">, "children" | "className" | "slot" | "style"> {
    /** Whether to draw a hairline border along the bottom edge of the header row. */
    bordered?: boolean;
    /** Controls the height of the header row. Falls back to the size inherited from the table. */
    size?: "sm" | "md";
}

const TableHeader = <T extends object>({ columns, children, bordered = true, className, size: sizeProp, ...props }: TableHeaderProps<T>) => {
    const context = useContext(TableContext);
    const { selectionBehavior, selectionMode } = useTableOptions();

    const size = sizeProp ?? context.size;

    return (
        <AriaTableHeader
            {...props}
            className={(state) =>
                cx(
                    "relative bg-zinc-50/70 dark:bg-zinc-900/40 text-zinc-500 dark:text-zinc-400 font-semibold",
                    size === "sm" ? "h-9" : "h-11",

                    // Row border
                    bordered &&
                        "[&>tr>th]:after:pointer-events-none [&>tr>th]:after:absolute [&>tr>th]:after:inset-x-0 [&>tr>th]:after:bottom-0 [&>tr>th]:after:h-px [&>tr>th]:after:bg-zinc-200/80 dark:[&>tr>th]:after:bg-zinc-800/80 [&>tr>th]:focus-visible:after:bg-transparent",

                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {selectionBehavior === "toggle" && (
                <AriaColumn className={cx("relative py-2 pr-0 pl-4", size === "sm" ? "w-9 md:pl-5" : "w-11 md:pl-6")}>
                    {selectionMode === "multiple" && (
                        <div className="flex items-start">
                            <Checkbox slot="selection" size="md" />
                        </div>
                    )}
                </AriaColumn>
            )}
            <AriaCollection items={columns}>{children}</AriaCollection>
        </AriaTableHeader>
    );
};

TableHeader.displayName = "TableHeader";

interface TableHeadProps extends AriaColumnProps, Omit<ThHTMLAttributes<HTMLTableCellElement>, "children" | "className" | "style" | "id"> {
    /** The column heading text, rendered before any children. */
    label?: string;
    /** Help text shown in a tooltip when hovering the help icon next to the heading. */
    tooltip?: string;
}

const TableHead = ({ className, tooltip, label, children, ...props }: TableHeadProps) => {
    const { size } = useContext(TableContext);
    const { selectionBehavior } = useTableOptions();

    return (
        <AriaColumn
            {...props}
            className={(state) =>
                cx(
                    "relative p-0 py-2.5 outline-hidden focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-bg-primary focus-visible:ring-inset",
                    size === "sm" ? "px-4 md:px-5" : "px-5 md:px-6",
                    selectionBehavior === "toggle" && "nth-2:pl-3",
                    state.allowsSorting && "cursor-pointer",
                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {(state) => (
                <AriaGroup className="flex items-center gap-1.5">
                    <div className="flex items-center gap-1">
                        {label && <span className="text-xs font-semibold whitespace-nowrap text-zinc-500 dark:text-zinc-400">{label}</span>}
                        {typeof children === "function" ? children(state) : children}
                    </div>

                    {tooltip && (
                        <Tooltip title={tooltip} placement="top">
                            <TooltipTrigger className="cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                                <HelpCircle className="size-3.5" />
                            </TooltipTrigger>
                        </Tooltip>
                    )}

                    {state.allowsSorting &&
                        (state.sortDirection ? (
                            <ArrowDown className={cx("size-3 stroke-[3px] text-zinc-400", state.sortDirection === "ascending" && "rotate-180")} />
                        ) : (
                            <ChevronSelectorVertical size={12} strokeWidth={3} className="text-zinc-400" />
                        ))}
                </AriaGroup>
            )}
        </AriaColumn>
    );
};
TableHead.displayName = "TableHead";

interface TableRowProps<T extends object>
    extends AriaRowProps<T>, Omit<ComponentPropsWithRef<"tr">, "children" | "className" | "onClick" | "slot" | "style" | "id"> {
    /** Whether the row keeps a secondary background while it is selected. */
    highlightSelectedRow?: boolean;
    /** Controls the height of the row. Falls back to the size inherited from the table. */
    size?: "sm" | "md";
}

const TableRow = <T extends object>({ columns, children, className, highlightSelectedRow = true, size: sizeProp, ...props }: TableRowProps<T>) => {
    const context = useContext(TableContext);
    const { selectionBehavior } = useTableOptions();

    const size = sizeProp ?? context.size;

    return (
        <AriaRow
            {...props}
            className={(state) =>
                cx(
                    "relative outline-focus-ring transition-colors after:pointer-events-none hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 focus-visible:outline-2 focus-visible:-outline-offset-2",
                    size === "sm" ? "h-12" : "h-16",
                    highlightSelectedRow && "selected:bg-zinc-50 dark:selected:bg-zinc-800/50",

                    // Row border
                    "[&>td]:after:absolute [&>td]:after:inset-x-0 [&>td]:after:bottom-0 [&>td]:after:h-px [&>td]:after:w-full [&>td]:after:bg-zinc-100 dark:[&>td]:after:bg-zinc-800/80 last:[&>td]:after:hidden [&>td]:focus-visible:after:opacity-0 focus-visible:[&>td]:after:opacity-0",

                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {selectionBehavior === "toggle" && (
                <AriaCell className={cx("relative py-2 pr-0 pl-4", size === "sm" ? "md:pl-5" : "md:pl-6")}>
                    <div className="flex items-end">
                        <Checkbox slot="selection" size="md" />
                    </div>
                </AriaCell>
            )}
            <AriaCollection items={columns}>{children}</AriaCollection>
        </AriaRow>
    );
};

TableRow.displayName = "TableRow";

interface TableCellProps extends AriaCellProps, Omit<TdHTMLAttributes<HTMLTableCellElement>, "children" | "className" | "style" | "id"> {
    /** A ref to the underlying `td` element. */
    ref?: Ref<HTMLTableCellElement>;
    /** Controls the horizontal and vertical padding of the cell. Falls back to the size inherited from the table. */
    size?: "sm" | "md";
}

const TableCell = ({ className, children, size: sizeProp, ...props }: TableCellProps) => {
    const context = useContext(TableContext);
    const { selectionBehavior } = useTableOptions();

    const size = sizeProp ?? context.size;

    return (
        <AriaCell
            {...props}
            className={(state) =>
                cx(
                    "relative text-xs text-zinc-700 dark:text-zinc-300 outline-focus-ring focus-visible:z-1 focus-visible:outline-2 focus-visible:-outline-offset-2",
                    size === "sm" && "px-4 py-2.5 md:px-5",
                    size === "md" && "px-5 py-3.5 md:px-6",

                    selectionBehavior === "toggle" && "nth-2:pl-3",

                    typeof className === "function" ? className(state) : className,
                )
            }
        >
            {children}
        </AriaCell>
    );
};
TableCell.displayName = "TableCell";

const TableCard = {
    Root: TableCardRoot,
    Header: TableCardHeader,
};

const Table = TableRoot as typeof TableRoot & {
    Body: typeof AriaTableBody;
    Cell: typeof TableCell;
    Head: typeof TableHead;
    Header: typeof TableHeader;
    Row: typeof TableRow;
};
Table.Body = AriaTableBody;
Table.Cell = TableCell;
Table.Head = TableHead;
Table.Header = TableHeader;
Table.Row = TableRow;

export { Table, TableCard };
